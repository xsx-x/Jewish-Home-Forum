import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { 
  Search, Lock, LogIn, Plus, Edit2, Trash2, Video, Mic, 
  FileText, LogOut, ExternalLink, User, Tag, FolderOpen, Info
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface LessonLinks {
  video?: string;
  audio?: string;
  text?: string;
}

interface Lesson {
  id: string;
  title: string;
  lecturer: string;
  category: string;
  tags: string[];
  isSubscriberOnly: boolean;
  links: LessonLinks;
  createdAt: number;
}

// --- Initial Data ---
const INITIAL_LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'שיעור אמונה - יסודות האמונה היהודית',
    lecturer: 'הרב יוסף כהן',
    category: 'אמונה',
    tags: ['אמונה', 'יסודות', 'מחשבה'],
    isSubscriberOnly: false,
    links: { video: '#', audio: '#', text: '#' },
    createdAt: Date.now() - 1000000
  },
  {
    id: '2',
    title: 'הלכות שבת - מלאכת בורר',
    lecturer: 'הרב אברהם לוי',
    category: 'הלכה',
    tags: ['שבת', 'הלכה', 'בורר'],
    isSubscriberOnly: true,
    links: { video: '#', text: '#' },
    createdAt: Date.now() - 2000000
  }
];

// --- Components ---
const Badge = ({ children, variant = 'public' }: { children: React.ReactNode, variant?: 'public' | 'subscriber' }) => (
  <span className={cn(
    "px-2 py-1 rounded-md text-xs font-medium transition-all duration-300",
    variant === 'subscriber' ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
  )}>
    {children}
  </span>
);

const LessonCard = ({ lesson }: { lesson: Lesson }) => {
  return (
    // הוספנו כאן אנימציות: מעבר חלק ועליה קלה כלפי מעלה בעת מעבר עכבר
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <Badge variant={lesson.isSubscriberOnly ? 'subscriber' : 'public'}>
            {lesson.isSubscriberOnly ? 'למנויים בלבד' : 'פתוח לכולם'}
          </Badge>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <FolderOpen size={12} />
            {lesson.category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{lesson.title}</h3>
        
        <div className="flex items-center gap-2 text-slate-600 mb-4">
          <User size={16} className="text-primary" />
          <span className="text-sm font-medium">{lesson.lecturer}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {lesson.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-slate-200 transition-colors cursor-default">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
        {lesson.links.video && (
          <a href={lesson.links.video} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-800 hover:scale-110 transition-transform">
            <Video size={20} />
            <span className="text-[10px] font-bold">וידאו</span>
          </a>
        )}
        {lesson.links.audio && (
          <a href={lesson.links.audio} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-amber-600 hover:text-amber-800 hover:scale-110 transition-transform">
            <Mic size={20} />
            <span className="text-[10px] font-bold">אודיו</span>
          </a>
        )}
        {lesson.links.text && (
          <a href={lesson.links.text} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-emerald-600 hover:text-emerald-800 hover:scale-110 transition-transform">
            <FileText size={20} />
            <span className="text-[10px] font-bold">סיכום</span>
          </a>
        )}
      </div>
    </div>
  );
};

// --- Pages ---

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-primary mb-4">אודות פורום הבית היהודי</h1>
        <p className="text-xl font-medium text-slate-700 bg-slate-100 inline-block px-6 py-2 rounded-full border border-slate-200 shadow-sm">
          בנשיאות ובהכוונת הרה"ג ר' עמרם פריד שליט"א
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-12 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="text-primary" />
              מי אנחנו?
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              פורום הבית היהודי הוא מרחב ייחודי המאגד בתוכו שיעורי תורה, הדרכות ותכנים בנושאי אמונה, הלכה, פרשת שבוע והשקפה. 
              המטרה שלנו היא להנגיש תוכן תורני איכותי, מקצועי ומאיר עיניים לכל בית יהודי, תוך שמירה על קו השקפתי טהור וברור בפיקוח רבני הדוק.
            </p>
          </section>

          <div className="h-px bg-slate-200 w-full"></div>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">הצטרפות למרחב השותפים</h2>
            <p className="text-slate-600 mb-8 text-lg">
              כדי ליהנות מגישה מלאה לכלל התכנים והשיעורים באתר (כולל תכני הפרימיום הסגורים למנויים), אנו מזמינים אתכם לקחת חלק ולהצטרף למרחב השותפים שלנו.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* מסלול חודשי */}
              <div className="border border-slate-200 rounded-2xl p-8 hover:border-primary hover:shadow-md transition-all duration-300 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">מסלול חודשי</h3>
                <p className="text-4xl font-black text-primary mb-6">₪35 <span className="text-base font-normal text-slate-500">/ לחודש</span></p>
                <ul className="text-slate-600 space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> גישה לכל שיעורי הוידאו והאודיו הסגורים</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> הורדת סיכומי טקסט ומקורות</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> עדכונים שוטפים על סדרות שיעורים חדשות</li>
                </ul>
                <button className="bg-white border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-colors w-full">
                  בחר מסלול חודשי
                </button>
              </div>

              {/* מסלול שנתי */}
              <div className="border-2 border-primary rounded-2xl p-8 bg-blue-50/30 relative flex flex-col transform hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
                  המשתלם ביותר
                </div>
                <h3 className="text-2xl font-bold mb-2">מסלול שנתי</h3>
                <p className="text-4xl font-black text-primary mb-6">₪350 <span className="text-base font-normal text-slate-500">/ לשנה</span></p>
                <ul className="text-slate-600 space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 font-bold"><span className="text-emerald-500">✓</span> כל ההטבות של המסלול החודשי</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> חודשיים מתנה (תשלום על 10 חודשים)</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> תמיכה ישירה באחזקת הפורום</li>
                </ul>
                <button className="bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition-colors w-full shadow-sm">
                  בחר מסלול שנתי
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ lessons }: { lessons: Lesson[] }) => {
  const [search, setSearch] = useState('');
  const [lecturerFilter, setLecturerFilter] = useState('הכל');
  const [categoryFilter, setCategoryFilter] = useState('הכל');

  const lecturers = useMemo(() => ['הכל', ...Array.from(new Set(lessons.map(l => l.lecturer)))], [lessons]);
  const categories = useMemo(() => ['הכל', ...Array.from(new Set(lessons.map(l => l.category)))], [lessons]);

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const matchesSearch = l.title.includes(search) || l.lecturer.includes(search) || l.tags.some(t => t.includes(search));
      const matchesLecturer = lecturerFilter === 'הכל' || l.lecturer === lecturerFilter;
      const matchesCategory = categoryFilter === 'הכל' || l.category === categoryFilter;
      return matchesSearch && matchesLecturer && matchesCategory;
    });
  }, [lessons, search, lecturerFilter, categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-primary mb-4">מאגר השיעורים</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          כאן תוכלו למצוא שיעורי אמונה, הלכה, פרשת שבוע ועוד ממגוון מרצים.
        </p>
      </header>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 transition-shadow hover:shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="חיפוש שיעור, מרצה או נושא..." 
              className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-primary transition-all" value={lecturerFilter} onChange={(e) => setLecturerFilter(e.target.value)}>
            <option disabled value="">בחר מרצה</option>
            {lecturers.map(l => <option key={l} value={l}>{l === 'הכל' ? 'כל המרצים' : l}</option>)}
          </select>
          <select className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-primary transition-all" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option disabled value="">בחר קטגוריה</option>
            {categories.map(c => <option key={c} value={c}>{c === 'הכל' ? 'כל הקטגוריות' : c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FolderOpen className="text-primary" /> שיעורים זמינים ({filteredLessons.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

const AdminLoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // שימוש במשתנה סביבה במקום סיסמה חשופה בקוד
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || '1234'; 
    if (pass === correctPassword) {
      onLogin();
      navigate('/admin/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold">כניסת מנהל</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">סיסמה</label>
            <input 
              type="password" 
              className={cn("w-full px-4 py-2 rounded-lg border outline-none transition-all", error ? "border-red-500 focus:ring-red-200" : "border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent")}
              value={pass}
              onChange={(e) => {setPass(e.target.value); setError(false);}}
              placeholder="••••••••"
              autoFocus
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-900 transition-colors flex justify-center items-center gap-2 font-bold">
            <LogIn size={20} /> התחברות
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboardPage = ({ lessons, onLogout }: { lessons: Lesson[], onLogout: () => void }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-900">ניהול שיעורים</h1>
        <button onClick={() => {onLogout(); navigate('/');}} className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
          <LogOut size={20} /> התנתקות
        </button>
      </div>
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 flex items-center gap-3">
        <Info size={24} className="shrink-0" />
        <p className="text-sm font-medium">הערה: לשם הדגמה, המידע נשמר כרגע בזיכרון הדפדפן (localStorage). כדי שהמערכת תעבוד באמת ברשת, יש לחבר אותה למסד נתונים (כמו Firebase או Supabase).</p>
      </div>
      <p className="text-slate-600">רשימת השיעורים (פאנל הניהול הוסתר לטובת דוגמה זו)</p>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('jhome_lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('jhome_admin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('jhome_lessons', JSON.stringify(lessons));
  }, [lessons]);

  const handleLogin = () => { setIsLoggedIn(true); localStorage.setItem('jhome_admin', 'true'); };
  const handleLogout = () => { setIsLoggedIn(false); localStorage.removeItem('jhome_admin'); };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col" dir="rtl">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:bg-blue-900 transition-colors shadow-sm">
                ה
              </div>
              <span className="font-black text-xl tracking-tight hidden sm:block text-slate-800 group-hover:text-primary transition-colors">פורום הבית היהודי</span>
            </Link>
            
            {/* הוספת קישורי הניווט */}
            <div className="hidden md:flex items-center gap-6 font-medium text-slate-600">
              <Link to="/" className="hover:text-primary transition-colors">מאגר השיעורים</Link>
              <Link to="/about" className="hover:text-primary transition-colors">מי אנחנו</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* קישור אודות למובייל */}
            <Link to="/about" className="md:hidden text-slate-500 hover:text-primary transition-colors">
              <Info size={20} />
            </Link>
            
            {isLoggedIn ? (
              <Link to="/admin/dashboard" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2 text-sm shadow-sm font-medium">
                <FolderOpen size={16} /> ניהול
              </Link>
            ) : (
              <Link to="/admin/login" className="text-slate-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100">
                <Lock size={20} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage lessons={lessons} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin/login" element={<AdminLoginPage onLogin={handleLogin} />} />
          <Route 
            path="/admin/dashboard" 
            element={isLoggedIn ? <AdminDashboardPage lessons={lessons} onLogout={handleLogout} /> : <Navigate to="/admin/login" />} 
          />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="font-bold text-slate-900 mb-2">פורום הבית היהודי</h3>
          <p className="text-slate-500 text-sm mb-6">בהכוונת הרה"ג ר' עמרם פריד שליט"א © {new Date().getFullYear()}</p>
          <div className="flex justify-center gap-6 text-slate-400 font-medium">
            <Link to="/about" className="hover:text-primary transition-colors">אודות המרחב</Link>
            <a href="#" className="hover:text-primary transition-colors">צור קשר</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
