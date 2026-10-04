'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Guru,
  Dudi,
  Placement,
  Attendance,
  Journal,
  Evaluation,
  SchoolSettings,
} from '@/types/database';
import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_GURU,
  INITIAL_DUDI,
  INITIAL_PLACEMENTS,
  INITIAL_ATTENDANCES,
  INITIAL_JOURNALS,
  INITIAL_EVALUATIONS,
} from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  createPlacement,
  updatePlacementStatus as sbUpdatePlacementStatus,
  updatePlacement as sbUpdatePlacement,
  createAttendance,
  updateCheckOut as sbUpdateCheckOut,
  createJournal,
  verifyJournalDb,
  fetchMyPlacements,
  fetchAllAttendances,
  fetchMyJournals,
} from '@/lib/siswa-service';

/* ------------------------------------------------------------------ */
/* Context type                                                         */
/* ------------------------------------------------------------------ */
interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  gurus: Guru[]; // Separate state for guru
  dudis: Dudi[];
  placements: Placement[];
  attendances: Attendance[];
  journals: Journal[];
  evaluations: Evaluation[];
  settings: SchoolSettings;
  loginAsRole: (role: 'admin' | 'guru' | 'siswa') => Promise<void>;
  loginWithCredentials: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  addDudi: (dudi: Omit<Dudi, 'id'>) => void;
  updateDudi: (id: string, dudi: Partial<Dudi>) => void;
  deleteDudi: (id: string) => void;
  addGuru: (guru: Omit<Guru, 'id'>) => Promise<void>;
  updateGuru: (id: string, data: Partial<Guru>) => Promise<void>;
  deleteGuru: (id: string) => Promise<void>;
  addPlacement: (placement: Omit<Placement, 'id'>) => Promise<void>;
  updatePlacementStatus: (id: string, status: Placement['status']) => Promise<void>;
  updatePlacement: (id: string, data: Partial<Placement>) => Promise<void>;
  recordAttendance: (attendance: Omit<Attendance, 'id'>) => Promise<void>;
  checkOutAttendance: (id: string, checkOutTime: string, photoOut?: string) => Promise<void>;
  addJournal: (journal: Omit<Journal, 'id' | 'status'>) => Promise<void>;
  updateJournal: (id: string, journal: Partial<Journal>) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;
  verifyJournal: (id: string, status: 'approved' | 'revision', feedback?: string) => Promise<void>;
  saveEvaluation: (evaluation: Omit<Evaluation, 'id' | 'updated_at'>) => void;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  addUser: (user: Omit<UserProfile, 'id'>) => void;
  updateUser: (id: string, data: Partial<UserProfile>) => void;
  refreshSiswaData: (studentId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ------------------------------------------------------------------ */
/* Provider                                                             */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [gurus, setGurus] = useState<Guru[]>(INITIAL_GURU);
  const [dudis, setDudis] = useState<Dudi[]>(INITIAL_DUDI);
  const [placements, setPlacements] = useState<Placement[]>(INITIAL_PLACEMENTS);
  const [attendances, setAttendances] = useState<Attendance[]>(INITIAL_ATTENDANCES);
  const [journals, setJournals] = useState<Journal[]>(INITIAL_JOURNALS);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(INITIAL_EVALUATIONS);
  const [settings, setSettings] = useState<SchoolSettings>(INITIAL_SETTINGS);

  /* ---------- Load from localStorage on mount ---------- */
  useEffect(() => {
    try {
      const load = <T,>(key: string, fallback: T): T => {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
      };
      const savedUser = load<UserProfile | null>('simmas_current_user', null);
      setCurrentUser(savedUser);
      setGurus(load('simmas_gurus', INITIAL_GURU));
      setDudis(load('simmas_dudis', INITIAL_DUDI));
      const storedPlacements = load('simmas_placements', INITIAL_PLACEMENTS);
      const storedAttendances = load('simmas_attendances', INITIAL_ATTENDANCES);
      const storedJournals = load('simmas_journals', INITIAL_JOURNALS);
      
      setPlacements(storedPlacements);
      setAttendances(storedAttendances);
      setJournals(storedJournals);
      setEvaluations(load('simmas_evaluations', INITIAL_EVALUATIONS));
      setSettings(load('simmas_settings', INITIAL_SETTINGS));
      setUsers(load('simmas_users', INITIAL_USERS));

      // Fetch guru from Supabase
      if (isSupabaseConfigured) {
        console.log('[AuthContext] Fetching guru from Supabase...');
        supabase
          .from('guru')
          .select('*')
          .order('name', { ascending: true })
          .then(({ data, error }) => {
            if (data && !error) {
              console.log('[AuthContext] Loaded', data.length, 'guru from Supabase');
              setGurus(data);
              save('simmas_gurus', data);
            } else {
              console.error('[AuthContext] Error fetching guru:', error);
            }
          });
      }

      // Jika Supabase aktif dan ada user yang login sebagai siswa, refresh data
      if (savedUser?.role === 'siswa' && isSupabaseConfigured) {
        refreshSiswaData(savedUser.id);
      }
    } catch (e) {
      console.error('Failed to load storage state:', e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Auto-generate ALPA for missing attendance ---------- */
  useEffect(() => {
    const checkAndGenerateAlpa = () => {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const hour = now.getHours();
      
      // Only run after 17:00 (5 PM) to check if student didn't clock in
      if (hour < 17) return;
      
      // Get all active placements
      const activePlacements = placements.filter(
        p => p.status === 'aktif' || p.status === 'approved'
      );
      
      // Check each student
      const newAlpaRecords: Attendance[] = [];
      activePlacements.forEach(placement => {
        // Check if attendance record exists for today
        const todayRecord = attendances.find(
          a => a.student_id === placement.student_id && a.date === today
        );
        
        // If no record exists, create ALPA
        if (!todayRecord) {
          const student = users.find(u => u.id === placement.student_id);
          if (student) {
            newAlpaRecords.push({
              id: 'alpa-' + Date.now() + '-' + placement.student_id,
              student_id: placement.student_id,
              student_name: student.name,
              dudi_name: placement.dudi_name,
              date: today,
              check_in: '',
              status: 'alpa',
              notes: 'Tidak hadir tanpa keterangan (Auto-generated)',
            });
          }
        }
      });
      
      // Add new ALPA records if any
      if (newAlpaRecords.length > 0) {
        const updated = [...newAlpaRecords, ...attendances];
        setAttendances(updated);
        save('simmas_attendances', updated);
        console.log(`[Auto-ALPA] Generated ${newAlpaRecords.length} ALPA records for ${today}`);
      }
    };
    
    // Run check immediately
    checkAndGenerateAlpa();
    
    // Check every hour
    const interval = setInterval(checkAndGenerateAlpa, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [placements, attendances, users]);


  /* ---------- Helpers ---------- */
  const save = <T,>(key: string, data: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving ${key}:`, e);
    }
  };

  /** Refresh data siswa dari Supabase (placements, attendances, journals) */
  const refreshSiswaData = async (studentId: string): Promise<void> => {
    console.log('[refreshSiswaData] Starting fetch for student:', studentId);
    
    const [sbPlacements, sbAttendances, sbJournals] = await Promise.all([
      fetchMyPlacements(studentId),
      fetchAllAttendances(studentId),
      fetchMyJournals(studentId),
    ]);

    console.log('[refreshSiswaData] Fetched:', {
      placements: sbPlacements?.length ?? 0,
      attendances: sbAttendances?.length ?? 0,
      journals: sbJournals?.length ?? 0,
    });

    // Update state dengan Promise untuk memastikan selesai
    return new Promise((resolve) => {
      if (sbPlacements) {
        setPlacements((prev) => {
          const others = prev.filter((p) => p.student_id !== studentId);
          const merged = [...sbPlacements, ...others];
          save('simmas_placements', merged);
          console.log('[refreshSiswaData] Placements updated:', merged.length);
          return merged;
        });
      }

      if (sbAttendances) {
        setAttendances((prev) => {
          const others = prev.filter((a) => a.student_id !== studentId);
          const merged = [...sbAttendances, ...others];
          save('simmas_attendances', merged);
          return merged;
        });
      }

      if (sbJournals) {
        setJournals((prev) => {
          const others = prev.filter((j) => j.student_id !== studentId);
          const merged = [...sbJournals, ...others];
          save('simmas_journals', merged);
          return merged;
        });
      }

      // Small delay to ensure state updates are processed
      setTimeout(() => {
        console.log('[refreshSiswaData] Completed');
        resolve();
      }, 100);
    });
  };

  /* ---------------------------------------------------------------- */
  /* Auth                                                              */
  /* ---------------------------------------------------------------- */
  const loginAsRole = async (role: 'admin' | 'guru' | 'siswa') => {
    const matched =
      users.find((u) => u.role === role) ?? INITIAL_USERS.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      save('simmas_current_user', matched);
      if (role === 'siswa' && isSupabaseConfigured) {
        await refreshSiswaData(matched.id);
      }
    }
  };

  const loginWithCredentials = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    // Akun demo - langsung pakai mock user, SKIP Supabase auth
    const demoPasswords: Record<string, string> = {
      'admin@simmas.sch.id': 'admin123',
      'guru@simmas.sch.id': 'guru123',
      'siswa@simmas.sch.id': 'siswa123',
    };
    
    // Check if demo account
    if (cleanEmail in demoPasswords) {
      if (password !== demoPasswords[cleanEmail]) {
        return false;
      }
      
      // Demo account - use mock user directly
      const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (user) {
        setCurrentUser(user);
        save('simmas_current_user', user);
        
        // Fetch data dari Supabase jika siswa
        if (user.role === 'siswa' && isSupabaseConfigured) {
          await refreshSiswaData(user.id);
        }
        return true;
      }
    }

    // Non-demo account: try Supabase auth
    if (isSupabaseConfigured && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (!error && data.user) {
          const profile: UserProfile = users.find(
            (u) => u.email.toLowerCase() === cleanEmail
          ) ?? {
            id: data.user.id,
            email: data.user.email ?? cleanEmail,
            name: data.user.user_metadata?.full_name ?? 'Pengguna SIMMAS',
            role: (data.user.user_metadata?.role as UserProfile['role']) ?? 'siswa',
          };
          setCurrentUser(profile);
          save('simmas_current_user', profile);
          if (profile.role === 'siswa') {
            await refreshSiswaData(profile.id);
          }
          return true;
        }
      } catch (err) {
        console.warn('Supabase signin error:', err);
      }
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('simmas_current_user');
    if (isSupabaseConfigured) supabase.auth.signOut().catch(() => {});
  };

  /* ---------------------------------------------------------------- */
  /* DUDI                                                              */
  /* ---------------------------------------------------------------- */
  const addDudi = (dudi: Omit<Dudi, 'id'>) => {
    const n: Dudi = { ...dudi, id: 'dudi-' + Date.now(), active_students: 0 };
    const u = [n, ...dudis];
    setDudis(u);
    save('simmas_dudis', u);
  };
  const updateDudi = (id: string, d: Partial<Dudi>) => {
    const u = dudis.map((x) => (x.id === id ? { ...x, ...d } : x));
    setDudis(u);
    save('simmas_dudis', u);
  };
  const deleteDudi = (id: string) => {
    const u = dudis.filter((x) => x.id !== id);
    setDudis(u);
    save('simmas_dudis', u);
  };

  /* ---------------------------------------------------------------- */
  /* PLACEMENTS                                                        */
  /* ---------------------------------------------------------------- */
  const addPlacement = async (p: Omit<Placement, 'id'>) => {
    console.log('[addPlacement] Starting with data:', p);
    const localId = 'plc-' + Date.now();
    let finalPlacement: Placement = { ...p, id: localId };

    // Coba Supabase dulu
    if (isSupabaseConfigured) {
      console.log('[addPlacement] Attempting Supabase insert...');
      const sbResult = await createPlacement(p);
      if (sbResult) {
        console.log('[addPlacement] Supabase insert SUCCESS:', sbResult);
        finalPlacement = sbResult;
      } else {
        console.error('[addPlacement] Supabase insert FAILED - using local ID');
      }
    } else {
      console.warn('[addPlacement] Supabase not configured - using localStorage only');
    }

    const u = [finalPlacement, ...placements];
    setPlacements(u);
    save('simmas_placements', u);
    console.log('[addPlacement] Placement saved to state and localStorage');
  };

  const updatePlacementStatus = async (id: string, status: Placement['status']) => {
    if (isSupabaseConfigured) {
      await sbUpdatePlacementStatus(id, status);
    }
    const u = placements.map((p) => (p.id === id ? { ...p, status } : p));
    setPlacements(u);
    save('simmas_placements', u);
  };

  const updatePlacement = async (id: string, data: Partial<Placement>) => {
    // Update placement dengan data tambahan (guru, dll)
    if (isSupabaseConfigured) {
      await sbUpdatePlacement(id, data);
    }
    const u = placements.map((p) => (p.id === id ? { ...p, ...data } : p));
    setPlacements(u);
    save('simmas_placements', u);
  };

  /* ---------------------------------------------------------------- */
  /* ATTENDANCES                                                       */
  /* ---------------------------------------------------------------- */
  const recordAttendance = async (a: Omit<Attendance, 'id'>) => {
    console.log('[recordAttendance] START - received data:', a);
    const localId = 'att-' + Date.now();
    
    // Upload photo jika ada
    let photoInUrl = a.photo_in;
    if (photoInUrl && photoInUrl.startsWith('data:')) {
      console.log('[recordAttendance] Uploading photo to Supabase Storage...');
      const { uploadPhoto, generatePhotoFilename } = await import('@/lib/siswa-service');
      const filename = generatePhotoFilename('att-in', a.student_id);
      const uploaded = await uploadPhoto(photoInUrl, 'attendance', filename);
      if (uploaded) {
        photoInUrl = uploaded;
        console.log('[recordAttendance] Photo uploaded successfully:', uploaded);
      } else {
        console.log('[recordAttendance] Photo upload failed, using data URL');
      }
    }

    const attendanceData = { ...a, photo_in: photoInUrl };
    let finalAtt: Attendance = { ...attendanceData, id: localId };
    console.log('[recordAttendance] attendanceData prepared:', attendanceData);

    if (isSupabaseConfigured) {
      console.log('[recordAttendance] Supabase configured, calling createAttendance...');
      const sbResult = await createAttendance(attendanceData);
      console.log('[recordAttendance] createAttendance result:', sbResult);
      if (sbResult) finalAtt = sbResult;
    } else {
      console.log('[recordAttendance] Supabase NOT configured, using local only');
    }

    const u = [finalAtt, ...attendances];
    console.log('[recordAttendance] Updating state with', u.length, 'attendances');
    setAttendances(u);
    save('simmas_attendances', u);
    console.log('[recordAttendance] SUCCESS - saved to state and localStorage');
  };

  const checkOutAttendance = async (id: string, checkOutTime: string, photoOut?: string) => {
    // Upload photo jika ada
    let photoOutUrl = photoOut;
    if (photoOutUrl && photoOutUrl.startsWith('data:')) {
      const { uploadPhoto, generatePhotoFilename } = await import('@/lib/siswa-service');
      const att = attendances.find(a => a.id === id);
      if (att) {
        const filename = generatePhotoFilename('att-out', att.student_id);
        const uploaded = await uploadPhoto(photoOutUrl, 'attendance', filename);
        if (uploaded) photoOutUrl = uploaded;
      }
    }

    if (isSupabaseConfigured) {
      await sbUpdateCheckOut(id, checkOutTime, photoOutUrl);
    }
    const u = attendances.map((a) =>
      a.id === id ? { ...a, check_out: checkOutTime, photo_out: photoOutUrl } : a
    );
    setAttendances(u);
    save('simmas_attendances', u);
  };

  /* ---------------------------------------------------------------- */
  /* JOURNALS                                                          */
  /* ---------------------------------------------------------------- */
  const addJournal = async (j: Omit<Journal, 'id' | 'status'>) => {
    const localId = 'jrn-' + Date.now();
    
    // Upload photo jika ada
    let photoUrl = j.photo;
    if (photoUrl && photoUrl.startsWith('data:')) {
      const { uploadPhoto, generatePhotoFilename } = await import('@/lib/siswa-service');
      const filename = generatePhotoFilename('jrn', j.student_id);
      const uploaded = await uploadPhoto(photoUrl, 'journal', filename);
      if (uploaded) photoUrl = uploaded;
    }

    const journalData = { ...j, photo: photoUrl };
    let finalJournal: Journal = { ...journalData, id: localId, status: 'pending' };

    if (isSupabaseConfigured) {
      const sbResult = await createJournal(journalData);
      if (sbResult) finalJournal = sbResult;
    }

    const u = [finalJournal, ...journals];
    setJournals(u);
    save('simmas_journals', u);
  };

  const updateJournal = async (id: string, updatedData: Partial<Journal>) => {
    console.log('[updateJournal] Starting update for:', id, 'keys:', Object.keys(updatedData));
    
    // Upload photo jika ada dan berupa base64
    let photoUrl = updatedData.photo;
    if (photoUrl && photoUrl.startsWith('data:')) {
      console.log('[updateJournal] Uploading photo to Storage...');
      const { uploadPhoto, generatePhotoFilename } = await import('@/lib/siswa-service');
      const journal = journals.find(j => j.id === id);
      if (journal) {
        const filename = generatePhotoFilename('jrn', journal.student_id);
        const uploaded = await uploadPhoto(photoUrl, 'journal', filename);
        if (uploaded) {
          console.log('[updateJournal] Photo uploaded successfully:', uploaded);
          photoUrl = uploaded;
        } else {
          console.error('[updateJournal] Photo upload failed');
        }
      } else {
        console.error('[updateJournal] Journal not found in state:', id);
      }
    }

    const updatePayload = { ...updatedData };
    if (photoUrl !== updatedData.photo) {
      updatePayload.photo = photoUrl;
    }

    console.log('[updateJournal] Final payload:', updatePayload);

    if (isSupabaseConfigured) {
      const { updateJournal: updateJournalDb } = await import('@/lib/siswa-service');
      const success = await updateJournalDb(id, {
        activity_description: updatePayload.activity_description,
        division: updatePayload.division,
        duration: updatePayload.duration,
        photo: updatePayload.photo,
      });
      console.log('[updateJournal] Supabase update result:', success);
    }
    const u = journals.map((j) =>
      j.id === id ? { ...j, ...updatePayload } : j
    );
    setJournals(u);
    save('simmas_journals', u);
  };

  const deleteJournal = async (id: string) => {
    if (isSupabaseConfigured) {
      const { deleteJournal: deleteJournalDb } = await import('@/lib/siswa-service');
      await deleteJournalDb(id);
    }
    const u = journals.filter((j) => j.id !== id);
    setJournals(u);
    save('simmas_journals', u);
  };

  const verifyJournal = async (
    id: string,
    status: 'approved' | 'revision',
    feedback?: string
  ) => {
    if (isSupabaseConfigured) {
      await verifyJournalDb(id, status, feedback);
    }
    const verifiedAt = new Date().toLocaleString('id-ID');
    const u = journals.map((j) =>
      j.id === id
        ? { ...j, status, feedback: feedback ?? j.feedback, verified_at: verifiedAt }
        : j
    );
    setJournals(u);
    save('simmas_journals', u);
  };

  /* ---------------------------------------------------------------- */
  /* EVALUATIONS                                                       */
  /* ---------------------------------------------------------------- */
  const saveEvaluation = (ev: Omit<Evaluation, 'id' | 'updated_at'>) => {
    const idx = evaluations.findIndex((e) => e.student_id === ev.student_id);
    const updated_at = new Date().toISOString().split('T')[0];
    let u: Evaluation[];
    if (idx >= 0) {
      u = [...evaluations];
      u[idx] = { ...u[idx], ...ev, updated_at };
    } else {
      u = [{ ...ev, id: 'eval-' + Date.now(), updated_at }, ...evaluations];
    }
    setEvaluations(u);
    save('simmas_evaluations', u);
  };

  /* ---------------------------------------------------------------- */
  /* SETTINGS / USERS                                                  */
  /* ---------------------------------------------------------------- */
  const updateSettings = (s: Partial<SchoolSettings>) => {
    const u = { ...settings, ...s };
    setSettings(u);
    save('simmas_settings', u);
  };

  const addUser = (user: Omit<UserProfile, 'id'>) => {
    const n: UserProfile = { ...user, id: 'u-' + Date.now() };
    const u = [...users, n];
    setUsers(u);
    save('simmas_users', u);
  };

  const updateUser = (id: string, data: Partial<UserProfile>) => {
    const u = users.map((user) => (user.id === id ? { ...user, ...data } : user));
    setUsers(u);
    save('simmas_users', u);
  };

  /* ---------------------------------------------------------------- */
  /* Guru CRUD                                                         */
  /* ---------------------------------------------------------------- */
  const addGuru = async (guru: Omit<Guru, 'id'>) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('guru')
        .insert(guru)
        .select()
        .single();
      
      if (data && !error) {
        const updated = [...gurus, data];
        setGurus(updated);
        save('simmas_gurus', updated);
        return;
      }
    }
    
    // Fallback to local
    const newGuru: Guru = { ...guru, id: `g-${Date.now()}`, created_at: new Date().toISOString() };
    const updated = [...gurus, newGuru];
    setGurus(updated);
    save('simmas_gurus', updated);
  };

  const updateGuru = async (id: string, data: Partial<Guru>) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('guru')
        .update(data)
        .eq('id', id);
      
      if (!error) {
        const updated = gurus.map(g => g.id === id ? { ...g, ...data } : g);
        setGurus(updated);
        save('simmas_gurus', updated);
        return;
      }
    }
    
    // Fallback to local
    const updated = gurus.map(g => g.id === id ? { ...g, ...data } : g);
    setGurus(updated);
    save('simmas_gurus', updated);
  };

  const deleteGuru = async (id: string) => {
    console.log('[deleteGuru] Attempting to delete guru:', id);
    
    if (isSupabaseConfigured) {
      console.log('[deleteGuru] Deleting from Supabase...');
      const { error } = await supabase
        .from('guru')
        .delete()
        .eq('id', id);
      
      if (!error) {
        console.log('[deleteGuru] Successfully deleted from Supabase');
        const updated = gurus.filter(g => g.id !== id);
        setGurus(updated);
        save('simmas_gurus', updated);
        return;
      } else {
        console.error('[deleteGuru] Supabase error:', error);
      }
    }
    
    // Fallback to local
    console.log('[deleteGuru] Using local storage fallback');
    const updated = gurus.filter(g => g.id !== id);
    setGurus(updated);
    save('simmas_gurus', updated);
  };

  /* ---------------------------------------------------------------- */
  /* Provide                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        gurus,
        dudis,
        placements,
        attendances,
        journals,
        evaluations,
        settings,
        loginAsRole,
        loginWithCredentials,
        logout,
        addDudi,
        updateDudi,
        deleteDudi,
        addGuru,
        updateGuru,
        deleteGuru,
        addPlacement,
        updatePlacementStatus,
        updatePlacement,
        recordAttendance,
        checkOutAttendance,
        addJournal,
        updateJournal,
        deleteJournal,
        verifyJournal,
        saveEvaluation,
        updateSettings,
        addUser,
        updateUser,
        refreshSiswaData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
