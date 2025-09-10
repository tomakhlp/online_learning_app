import {GLOBAL_TEXT} from "./global.ts";

export const PAGES_TEXT = {
    MY_ACCOUNT: {
        HEADER: GLOBAL_TEXT.COMMON.MY_ACCOUNT,
        TRAININGS: {
            HEADER: GLOBAL_TEXT.HEADING.MY_TRAININGS,
            DESCRIPTION: `Der Trainingsbereich ist interaktiv und ermöglicht es Ihnen, mit Trainern und anderen Lernenden in Kontakt zu treten, 
                          an Quizfragen teilzunehmen und Ihren Fortschritt zu verfolgen. Alle unsere Kurse sind flexibel und anpassungsfähig 
                          an Ihren Zeitplan und Ihr Lerntempo.`,
        },
        SECTIONS: {
            TRAINER: {
                HEADER: GLOBAL_TEXT.HEADING.MY_STUDENTS,
            },
            STUDENT: {
                HEADER: GLOBAL_TEXT.HEADING.MY_TRAINERS,
            },
            MY_PROFILE: {
                HEADER: 'Mein Profil',
                STATUS: GLOBAL_TEXT.COMMON.STATUS,
            },
            EDIT_PROFILE: {
                HEADER: 'Profil bearbeiten',
                PHOTO: {
                    HEADER: 'Profilfoto',
                    UPLOAD_LABEL: 'Laden Sie Ihr Foto hoch',
                    UPLOAD_INSTRUCTION: 'Ihr Foto sollte im PNG- oder JPG-Format vorliegen',
                }
            },
        },
    },
    ADD_TRAINER: {
        HEADER: GLOBAL_TEXT.COMMON.ADD_TRAINER,
        INSTRUCTIONS: "Bitte wählen Sie Trainer aus, um sie Ihrer Liste hinzuzufügen.",
        NO_REMOVAL_NOTE: "* - Trainer können nicht entfernt werden, sobald sie hinzugefügt wurden.",
    },
    ADD_TRAINING: {
        HEADING: 'Abgeschlossene Schulung hinzufügen',
    },
    CHANGE_PASSWORD: {
        HEADER: "Sicherheit",
        SUBHEADER: GLOBAL_TEXT.COMMON.CHANGE_PASSWORD,
        SUCCESS: {
            CONGRATS: 'Passwort geändert',
            DESCRIPTION: 'Bitte melden Sie sich mit Ihrem neuen Passwort an.',
        }
    },
    BLOG: {
        HEADER: GLOBAL_TEXT.COMMON.BLOG,
    },
    HOME: {
        GREETING: {
            SIGNED_IN: "Hallo, {{name}}!",
            SIGNED_OUT: "Lass uns mit dem Lernen beginnen!",
        },
        WELCOME_MESSAGE: `Willkommen bei der Learn-Plattform - wo jeder Tag ein Lerntag ist. Tauchen Sie ein in den Ozean des Wissens
                          und rüsten Sie sich mit Werkzeugen für ein erfolgreiches Morgen. Viel Spaß beim Lernen!`,
        WHATS_NEW: {
            HEADER: "Was gibt's Neues?",
            DESCRIPTION: `Entdecken Sie frische Artikel, detaillierte Tutorials und die neuesten technischen Einblicke, die Sie auf Ihrem
                          Lernweg weiterbringen. Egal, ob Sie gerade erst anfangen oder Ihre Fähigkeiten verfeinern – hier ist für jeden etwas dabei.`,
        },
        BANNER: {
            HEADER: GLOBAL_TEXT.COMMON.JOIN_US,
            DESCRIPTION: `Entdecken Sie eine lebendige Gemeinschaft von Lernenden und Experten. Vernetzen Sie sich, teilen Sie Ideen, 
                          und erweitern Sie Ihr Wissen gemeinsam mit Gleichgesinnten aus der ganzen Welt.`,
        },
    },
    JOIN_US: {
        HEADER: GLOBAL_TEXT.COMMON.JOIN_US,
        SECTIONS: {
            TITLE: "Registrieren als {{role}}",
            TRAINER: {
                ROLE: 'Lehrende',
                DESCRIPTION: "Treten Sie unserer Plattform bei und befähigen Sie Menschen durch Mentoring.",
            },
            STUDENT: {
                ROLE: 'Studierende',
                DESCRIPTION: "Treten Sie unserer Plattform bei und erhalten Sie Zugang zu Bildungsressourcen.",
            },
        },
    },
    LOGIN: {
        HEADER: GLOBAL_TEXT.COMMON.SIGN_IN,
        SUBHEADING: "Willkommen zurück",
        OR_TEXT: "oder",
        SIGN_UP_PROMPT: "Sie haben kein Konto?",
    },
    NOT_FOUND: {
        HEADER: "404 - Seite nicht gefunden",
        DESCRIPTION: "Entschuldigung, die gesuchte Seite existiert nicht oder wurde verschoben.",
        LINK_TEXT: "← Zurück zur Startseite",
    },
    REGISTRATION: {
        HEADER: GLOBAL_TEXT.COMMON.REGISTRATION,
        SUCCESS: {
            CONGRATS: "Glückwunsch, Sie haben sich erfolgreich bei der Learn-Plattform registriert! Hier sind Ihre Anmeldedaten, die Sie in Ihrem Konto ändern können:",
            USERNAME_LABEL: "Benutzername",
            PASSWORD_LABEL: "Passwort",
        },
    },
    ABOUT_US: {
        HEADER: GLOBAL_TEXT.COMMON.ABOUT_US,
        DESCRIPTION: `Willkommen im Abschnitt 'Über uns' der Learn-Plattform. Hier möchten wir Ihnen ein tieferes Verständnis unserer Philosophie, Werte und Mission vermitteln. 
                      Gegründet im Jahr 2023, wurde die Learn-Plattform aus der Leidenschaft für das Lernen und dem Glauben an die Macht des Wissens geboren, das Leben zu verändern.`,
        TEAM: {
            HEADER: "Unser Team",
            DESCRIPTION: `Lernen Sie das Team hinter unserer Kursplattform kennen, das sich der Bereitstellung hochwertiger Lernerfahrungen widmet.`,
        },
    },
    FEATURES: {
        HEADER: GLOBAL_TEXT.COMMON.FEATURES,
        LEARNING: {
            HEADER: "Lernen",
            DESCRIPTION: `Innovative Werkzeuge und Strategien, die das Lernen verbessern und es effektiver,
                          zugänglicher und ansprechender für alle machen, unabhängig von ihrem Fähigkeitsniveau.`,
        },
        SECTION_ONE: {
            HEADER: "Interaktive Lernwerkzeuge",
            DESCRIPTION: `Beteiligen Sie sich an Quizfragen, Simulationen und praxisnahen Übungen, die aktives Lernen fördern und die langfristige Behaltensleistung durch
                          Praxis und Feedback verbessern.`,
        },
        SECTION_TWO: {
            HEADER: "Personalisierte Lernwege",
            DESCRIPTION: `Inhalte passen sich Ihren Zielen, Ihrem Tempo und Ihrem Fortschritt an – und sorgen so für ein gezielteres und
                          effektiveres Lernverhalten, das auf individuellen Bedürfnissen basiert.`,
        },
    },
    PRICING: {
        HEADER: GLOBAL_TEXT.COMMON.PRICING,
        DESCRIPTION: `Bei der Learn-Plattform glauben wir daran, hochwertige Bildung zugänglicher und erschwinglicher zu machen. Wir bieten verschiedene Preispläne 
                      an, die auf individuelle Lernende, Gruppen und Organisationen zugeschnitten sind. Lassen Sie uns jede Option unten erkunden:`,
        FAQ: {
            HEADER: 'Häufig gestellte Fragen',
            DESCRIPTION: 'Finden Sie Antworten auf die häufigsten Fragen zu unseren Preisen, Funktionen und Support.',
        },
    },
    TRAININGS: {
        HEADER: GLOBAL_TEXT.COMMON.TRAININGS,
        SEARCH_HEADER: "Trainings durchsuchen",
        TABLE_HEADER: {
            STUDENT: "Meine abgeschlossenen Trainings",
            TRAINER: "Ergebnisse",
        },
    },
    COMING_SOON: {
        HEADER: "🚧 Seite in Bearbeitung",
        DESCRIPTION: "Wir arbeiten an dieser Seite, und sie wird bald verfügbar sein. Danke für Ihre Geduld!",
        LINK_TEXT: "← Zurück zur Startseite",
    },
};
