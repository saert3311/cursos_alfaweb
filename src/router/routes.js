import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

//funcion para saber si tengo usuario activo
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

const TITLE = "Cursos AlfaWeb";
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "admin", component: () => import("pages/AdminPage.vue") },
      {
        path: "/admin/edit/:id",
        name: "editCourse",
        component: () => import("pages/EditCoursePage.vue"),
        props: true,
      },
    ],
    beforeEnter: async (to, from) => {
      if ((await getCurrentUser()) === null && to.name !== "login") {
        return { name: "login" };
      }
    },
  },
  {
    path: "/user",
    name: "user",
    component: () => import("layouts/FullLayout.vue"),
    redirect: "/user/login",
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("pages/LoginPage.vue"),
        meta: { title: `${TITLE} - Login` },
        beforeEnter: async (to, from) => {
          if ((await getCurrentUser()) !== null && to.name !== "home") {
            return { name: "home" };
          }
        },
      },
      {
        path: "register",
        name: "register",
        component: () => import("pages/RegisterPage.vue"),
        meta: { title: `${TITLE} - Registro` },
        beforeEnter: async (to, from) => {
          if ((await getCurrentUser()) !== null && to.name !== "home") {
            return { name: "home" };
          }
        },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
