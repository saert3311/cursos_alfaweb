import { defineStore } from "pinia";
import { db } from "../firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  Timestamp,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const useCourses = defineStore("CourseStore", {
  state: () => ({
    courses: [],
  }),
  getters: {
    fullResume: (state) => {
      const total_alumns = state.courses.reduce(
        (accum, current) => accum + parseInt(current.registered),
        0
      );
      const max_alumns = state.courses.reduce(
        (accum, current) => accum + parseInt(current.quota),
        0
      );
      const avaliable = max_alumns - total_alumns;
      const finished = [...state.courses].filter(
        (course) => course.finished
      ).length;
      const running = [...state.courses].filter(
        (course) => !course.finished
      ).length;
      const total_courses = state.courses.length;
      return {
        // senti que era mas comodo hacer un objeto que devolviera todo en vez de hacer varios getters
        max_alumns: max_alumns,
        total_alumns: total_alumns,
        avaliable: avaliable,
        finished: finished,
        running: running,
        total_courses: total_courses,
      };
    },
  },
  actions: {
    async fetchCourses() {
      try {
        let query = await getDocs(collection(db, "courses"));
        this.courses = [];
        query.forEach((course) => {
          this.courses.push({
            ...course.data(),
            id: course.id,
          });
        });
        this.coursesIsFetched = true;
      } catch (e) {
        console.log(e);
        return "error";
      }
    },
    async createCourse(course) {
      try {
        const docData = { ...course, date: Timestamp.fromDate(new Date()) }; //destructuro y aprovecho a inyectar la fecha
        const response = await addDoc(collection(db, "courses"), docData);
        return response;
      } catch (e) {
        console.log(e);
        return e;
      }
    },
    async updateCourse(course) {
      try {
        let { docData, stringDate } = course;
        let preDate = new Date(stringDate); //esto fue un cacho
        let offset = preDate.getTimezoneOffset() * 60;
        docData.date = Timestamp.fromDate(preDate); //agrego el date como lo pide firebase antes de guardar
        docData.date.seconds = docData.date.seconds + offset; //el timestamp es un objeto le sumo la diferencia de la timezone para que lo guarde bien
        const response = await updateDoc(
          doc(db, "courses", docData.id),
          docData
        );
        return "ok";
      } catch (e) {
        console.log(e);
        return { error: e };
      }
    },
    async fetchCourseById(id) {
      try {
        const docRef = doc(db, "courses", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return {
            course: {
              ...docSnap.data(),
              id: docSnap.id,
            },
            stringDate: docSnap
              .data()
              .date.toDate()
              .toISOString()
              .substring(0, 10),
          };
        } else {
          return { error: "El curso no existe" };
        }
      } catch (e) {
        console.log(e);
        return new Error(e);
      }
    },
    async deleteCourseById(id) {
      try {
        await deleteDoc(doc(db, "courses", id));
        return "ok";
      } catch (e) {
        console.log(e);
        return { error: e };
      }
    },
  },
});
