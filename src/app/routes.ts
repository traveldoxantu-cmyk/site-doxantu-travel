import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Home } from './pages/Home';
import { StudentSupport } from './pages/StudentSupport';
import { Ticketing } from './pages/Ticketing';
import { VisaAssistance } from './pages/VisaAssistance';
import { StudiesAbroad } from './pages/StudiesAbroad';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { QuoteRequest } from './pages/QuoteRequest';
import { LegalMentions } from './pages/LegalMentions';
import { Dashboard } from './pages/Dashboard';
import { MonDossier } from './pages/MonDossier';
import { MesDocuments } from './pages/MesDocuments';
import { Messagerie } from './pages/Messagerie';
import { Echeances } from './pages/Echeances';
import { Profil } from './pages/Profil';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'services/accompagnement-etudiant', Component: StudentSupport },
      { path: 'services/billetterie', Component: Ticketing },
      { path: 'services/visa-documents', Component: VisaAssistance },
      { path: 'etudes-etranger', Component: StudiesAbroad },
      { path: 'a-propos', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'devis', Component: QuoteRequest },
      { path: 'mentions-legales', Component: LegalMentions },
    ],
  },
  {
    path: '/connexion',
    Component: Login,
  },
  {
    path: '/mon-espace',
    Component: Login, // Defaults to login when accessing root space
  },
  {
    path: '/mon-espace',
    Component: DashboardLayout,
    children: [
      { path: 'dashboard', Component: Dashboard },
      { path: 'dossier', Component: MonDossier },
      { path: 'documents', Component: MesDocuments },
      { path: 'messagerie', Component: Messagerie },
      { path: 'echeances', Component: Echeances },
      { path: 'profil', Component: Profil },
    ],
  },
]);
