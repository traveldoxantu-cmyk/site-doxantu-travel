import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Home } from './pages/Home';

// Lazy load other public pages
const StudentSupport = () => import('./pages/StudentSupport').then(m => ({ Component: m.StudentSupport }));
const Ticketing = () => import('./pages/Ticketing').then(m => ({ Component: m.Ticketing }));
const VisaAssistance = () => import('./pages/VisaAssistance').then(m => ({ Component: m.VisaAssistance }));
const StudiesAbroad = () => import('./pages/StudiesAbroad').then(m => ({ Component: m.StudiesAbroad }));
const About = () => import('./pages/About').then(m => ({ Component: m.About }));
const Contact = () => import('./pages/Contact').then(m => ({ Component: m.Contact }));
const QuoteRequest = () => import('./pages/QuoteRequest').then(m => ({ Component: m.QuoteRequest }));
const LegalMentions = () => import('./pages/LegalMentions').then(m => ({ Component: m.LegalMentions }));
const Login = () => import('./pages/Login').then(m => ({ Component: m.Login }));
const NotFound = () => import('./pages/NotFound').then(m => ({ Component: m.default }));

// Lazy load layouts and dashboard pages
const DashboardLayout = () => import('./layouts/DashboardLayout').then(m => ({ Component: m.DashboardLayout }));
const Dashboard = () => import('./pages/Dashboard').then(m => ({ Component: m.Dashboard }));
const MonDossier = () => import('./pages/MonDossier').then(m => ({ Component: m.MonDossier }));
const MesDocuments = () => import('./pages/MesDocuments').then(m => ({ Component: m.MesDocuments }));
const Messagerie = () => import('./pages/Messagerie').then(m => ({ Component: m.Messagerie }));
const ClientPayment = () => import('./pages/ClientPayment').then(m => ({ Component: m.ClientPayment }));
const Echeances = () => import('./pages/Echeances').then(m => ({ Component: m.Echeances }));
const Profil = () => import('./pages/Profil').then(m => ({ Component: m.Profil }));

const AdminLayout = () => import('./layouts/AdminLayout').then(m => ({ Component: m.AdminLayout }));
const AdminDashboard = () => import('./pages/AdminDashboard').then(m => ({ Component: m.AdminDashboard }));
const AdminClients = () => import('./pages/AdminClients').then(m => ({ Component: m.AdminClients }));
const AdminTeam = () => import('./pages/AdminTeam').then(m => ({ Component: m.AdminTeam }));
const AdminSettings = () => import('./pages/AdminSettings').then(m => ({ Component: m.AdminSettings }));
const AdminDemandes = () => import('./pages/AdminDemandes').then(m => ({ Component: m.AdminDemandes }));
const ComingSoon = () => import('./pages/ComingSoon').then(m => ({ Component: m.ComingSoon }));
const AdminMessagerie = () => import('./pages/AdminMessagerie').then(m => ({ Component: m.AdminMessagerie }));

export const router = createBrowserRouter([
  // ─── Site public ───────────────────────────────────────────────────────────
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'services/accompagnement-etudiant', lazy: StudentSupport },
      { path: 'services/billetterie', lazy: Ticketing },
      { path: 'services/visa-documents', lazy: VisaAssistance },
      { path: 'etudes-etranger', lazy: StudiesAbroad },
      { path: 'a-propos', lazy: About },
      { path: 'contact', lazy: Contact },
      { path: 'devis', lazy: QuoteRequest },
      { path: 'mentions-legales', lazy: LegalMentions },
      { path: 'bientot', lazy: ComingSoon },
      { path: '*', lazy: NotFound },
    ],
  },

  // ─── Connexion ─────────────────────────────────────────────────────────────
  { path: '/connexion', lazy: Login },

  // ─── Espace client ─────────────────────────────────────────────────────────
  {
    path: '/mon-espace',
    lazy: DashboardLayout,
    children: [
      { index: true, lazy: Dashboard },
      { path: 'dashboard', lazy: Dashboard },
      { path: 'dossier', lazy: MonDossier },
      { path: 'documents', lazy: MesDocuments },
      { path: 'messagerie', lazy: Messagerie },
      { path: 'paiement', lazy: ClientPayment },
      { path: 'echeances', lazy: Echeances },
      { path: 'profil', lazy: Profil },
    ],
  },

  // ─── Espace admin ──────────────────────────────────────────────────────────
  {
    path: '/admin',
    lazy: AdminLayout,
    children: [
      { index: true, lazy: AdminDashboard },
      { path: 'dashboard', lazy: AdminDashboard },
      { path: 'clients', lazy: AdminClients },
      { path: 'finance', lazy: ComingSoon },
      { path: 'reporting', lazy: ComingSoon },
      { path: 'conseillers', lazy: AdminTeam },
      { path: 'demandes', lazy: AdminDemandes },
      { path: 'messagerie', lazy: AdminMessagerie },
      { path: 'parametres', lazy: AdminSettings },
    ],
  },
]);
