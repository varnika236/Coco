/* =====================================================
   COCO - SHARED FIREBASE & AUTHENTICATION SCRIPT
===================================================== */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


/* =====================================================
   FIREBASE CONFIG
===================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyA4Lm898pcieoQ4WfA7qrQfWUx0QF7OtR8",
  authDomain: "coco-be2df.firebaseapp.com",
  projectId: "coco-be2df",
  storageBucket: "coco-be2df.firebasestorage.app",
  messagingSenderId: "558698026766",
  appId: "1:558698026766:web:91a440af23e105ace3a95f"
};


/* =====================================================
   INITIALIZE FIREBASE
===================================================== */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


/* =====================================================
   AUTHENTICATION GUARD
===================================================== */

/*
    Every protected page should have:

    <body data-auth-page="true">

    If the user is not logged in,
    they are automatically redirected
    to login.html.
*/

if (
    document.body.dataset.authPage === "true"
) {

    onAuthStateChanged(
        auth,
        (user) => {

            if (!user) {

                window.location.replace(
                    "login.html"
                );

                return;

            }


            /* =========================================
               DISPLAY USER INFORMATION
            ========================================= */

            const userNameElements =
                document.querySelectorAll(
                    "[data-user-name]"
                );


            const userEmailElements =
                document.querySelectorAll(
                    "[data-user-email]"
                );


            const userInitialElements =
                document.querySelectorAll(
                    "[data-user-initial]"
                );


            const displayName =
                user.displayName ||
                user.email?.split("@")[0] ||
                "Coco User";


            const email =
                user.email || "";


            const firstLetter =
                displayName
                    .trim()
                    .charAt(0)
                    .toUpperCase();


            userNameElements.forEach(
                element => {

                    element.textContent =
                        displayName;

                }
            );


            userEmailElements.forEach(
                element => {

                    element.textContent =
                        email;

                }
            );


            userInitialElements.forEach(
                element => {

                    element.textContent =
                        firstLetter;

                }
            );


            /*
             * Dispatch an event so individual
             * pages can use the authenticated
             * user if needed.
             */

            document.dispatchEvent(
                new CustomEvent(
                    "cocoUserReady",
                    {
                        detail: user
                    }
                )
            );

        }
    );

}


/* =====================================================
   LOGOUT
===================================================== */

document.addEventListener(
    "click",
    async (event) => {

        const logoutButton =
            event.target.closest(
                "[data-logout]"
            );


        if (!logoutButton) {

            return;

        }


        try {

            logoutButton.disabled = true;

            logoutButton.textContent =
                "Logging out...";


            await signOut(auth);


            window.location.replace(
                "login.html"
            );


        } catch (error) {

            console.error(
                "Coco logout error:",
                error
            );


            logoutButton.disabled = false;

            logoutButton.textContent =
                "Log out";

            alert(
                "Unable to log out. Please try again."
            );

        }

    }
);


/* =====================================================
   ACTIVE SIDEBAR LINK
===================================================== */

const currentPage =
    window.location.pathname
        .split("/")
        .pop();


document
    .querySelectorAll(
        ".sidebar-link"
    )
    .forEach(link => {

        const href =
            link.getAttribute("href");


        if (
            href &&
            href === currentPage
        ) {

            link.classList.add(
                "active"
            );

        }

    });