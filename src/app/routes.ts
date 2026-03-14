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
import { Login } from './pages/Login';
import NotFound from './pages/NotFound';
// Client dashboard
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { MonDossier } from './pages/MonDossier';
import { MesDocuments } from './pages/MesDocuments';
import { Messagerie } from './pages/Messagerie';
import { ClientPayment } from './pages/ClientPayment';
import { Echeances } from './pages/Echeances';
import { Profil } from './pages/Profil';
// Admin dashboard
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminClients } from './pages/AdminClients';
import { AdminFinance } from './pages/AdminFinance';
import { AdminReporting } from './pages/AdminReporting';
import { AdminTeam } from './pages/AdminTeam';
import { AdminSettings } from './pages/AdminSettings';

export const router = createBrowserRouter([
  // ─── Site public ───────────────────────────────────────────────────────────
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
      { path: '*', Component: NotFound },
    ],
  },

  // ─── Connexion ─────────────────────────────────────────────────────────────
  { path: '/connexion', Component: Login },

  // ─── Espace client ─────────────────────────────────────────────────────────
  {
    path: '/mon-espace',
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'dashboard', Component: Dashboard },
      { path: 'dossier', Component: MonDossier },
      { path: 'documents', Component: MesDocuments },
      { path: 'messagerie', Component: Messagerie },
      { path: 'paiement', Component: ClientPayment },
      { path: 'echeances', Component: Echeances },
      { path: 'profil', Component: Profil },
    ],
  },

  // ─── Espace admin ──────────────────────────────────────────────────────────
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'dashboard', Component: AdminDashboard },
      { path: 'clients', Component: AdminClients },
      { path: 'finance', Component: AdminFinance },
      { path: 'reporting', Component: AdminReporting },
      { path: 'conseillers', Component: AdminTeam },
      { path: 'parametres', Component: AdminSettings },
    ],
  },
]);
