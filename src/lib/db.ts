import { db, isFirebaseConfigured } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, writeBatch, query, where } from 'firebase/firestore';

// Helper to get data from Firebase with localStorage fallback
const getData = async (key: string, defaultValue: any) => {
  if (isFirebaseConfigured) {
    try {
      if (Array.isArray(defaultValue)) {
        const querySnapshot = await getDocs(collection(db, key));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map(doc => doc.data());
          localStorage.setItem(key, JSON.stringify(data));
          return data;
        }
      } else {
        const docRef = doc(db, 'singletons', key);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().data;
          localStorage.setItem(key, JSON.stringify(data));
          return data;
        }
      }
    } catch (error) {
      console.warn(`Firebase error fetching ${key}. Using local storage.`, error);
    }
  }
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
};

// Helper to save data to Firebase and localStorage
const saveData = async (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
  if (isFirebaseConfigured) {
    try {
      if (Array.isArray(data)) {
        const querySnapshot = await getDocs(collection(db, key));
        const batch = writeBatch(db);
        
        // Delete existing docs
        querySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        // Add new docs
        data.forEach(item => {
          const docRef = doc(collection(db, key), item.id || Math.random().toString());
          batch.set(docRef, item);
        });
        
        await batch.commit();
      } else {
        const docRef = doc(db, 'singletons', key);
        await setDoc(docRef, { data });
      }
    } catch (error) {
      console.warn(`Firebase error saving ${key}. Saved to local storage only.`, error);
    }
  }
};

export const getStudents = () => getData('students', []);
export const saveStudents = (students: any) => saveData('students', students);

export const getZoomLinks = () => getData('zoomLinks', []);
export const saveZoomLinks = (links: any) => saveData('zoomLinks', links);

export const getCourses = () => getData('courses', []);
export const saveCourses = (courses: any) => saveData('courses', courses);

export const getYoutubeLinks = () => getData('youtubeLinks', []);
export const saveYoutubeLinks = (links: any) => saveData('youtubeLinks', links);

export const getFees = () => getData('fees', []);
export const saveFees = (fees: any) => saveData('fees', fees);

export const getAttendance = () => getData('attendance', []);
export const saveAttendance = (attendance: any) => saveData('attendance', attendance);

export const getSchedule = () => getData('schedule', []);
export const saveSchedule = (schedule: any) => saveData('schedule', schedule);

export const getClassLinks = () => getData('classLinks', {});
export const saveClassLinks = (links: any) => saveData('classLinks', links);

export const getHomework = () => getData('homework', []);
export const saveHomework = (homework: any) => saveData('homework', homework);

export const initDB = async () => {
  const students = await getStudents();
  if (!students || students.length === 0) {
    await saveStudents([]);
  }
  
  const zoomLinks = await getZoomLinks();
  if (!zoomLinks || zoomLinks.length === 0) {
    await saveZoomLinks([
      { id: "1", grade: "Grade 10", title: "Tamil Live Class", link: "https://zoom.us/j/123456789", datetime: "2026-03-05T10:00" }
    ]);
  }
  
  const courses = await getCourses();
  if (!courses || courses.length === 0) {
    await saveCourses([
      { id: "1", grade: "Grade 10", title: "Science", link: "https://www.agaramdhines.lk/courses/g10-science" }
    ]);
  }
  
  const youtubeLinks = await getYoutubeLinks();
  if (!youtubeLinks || youtubeLinks.length === 0) {
    await saveYoutubeLinks([
      { id: "1", title: "Tamil Chapter 1", link: "https://www.youtube.com/watch?v=12345" }
    ]);
  }
  
  const schedule = await getSchedule();
  if (!schedule || schedule.length === 0) {
    await saveSchedule([
      { id: "1", grade: "Grade 10", day: "Monday", time: "08:00 AM", subject: "Tamil", link: "https://zoom.us/j/123" }
    ]);
  }
  
  const classLinks = await getClassLinks();
  if (!classLinks || Object.keys(classLinks).length === 0) {
    await saveClassLinks({});
  }
  
  const homework = await getHomework();
  if (!homework || homework.length === 0) {
    await saveHomework([
      {
        id: "1",
        grade: "Grade 10",
        title: "Tamil Chapter 1 Exercise",
        description: "Complete all exercises at the end of Chapter 1.",
        date: new Date().toISOString().split('T')[0]
      }
    ]);
  }
};

// மாணவரின் கட்டண விபரத்தைப் பெற
export const getStudentPayments = async (studentId: string) => {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "payments"), where("student_id", "==", studentId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.warn("Firebase error fetching student payments:", error);
    }
  }
  return [];
};
