import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { 
  Search, 
  Lock, 
  LogIn, 
  Plus, 
  Edit2, 
  Trash2, 
  Video, 
  Mic, 
  FileText, 
  Filter, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Check,
  X,
  User,
  Tag,
  FolderOpen
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
    links: {
      video: 'https://drive.google.com/file/d/1',
      audio: 'https://drive.google.com/file/d/2',
      text: 'https://drive.google.com/file/d/3'
    },
    createdAt: Date.now() - 1000000
  },
  {
    id: '2',
    title: 'הלכות שבת - מלאכת בורר',
    lecturer: 'הרב אברהם לוי',
    category: 'הלכה',
    tags: ['שבת', 'הלכה', 'בורר'],
    isSubscriberOnly: true,
    links: {
      video: 'https://drive.google.com/file/d/4',
      text: 'https://drive.google.com/file/d/5'
    },
    createdAt: Date.now() - 2000000
  },
  {
    id: '3',
    title: 'פרשת שבוע - פרשת בראשית',
    lecturer: 'הרב יצחק מזרחי',
    category: 'פרשת שבוע',
    tags: ['בראשית', 'תורה', 'פרשה'],
    isSubscriberOnly: false,
    links: {
      audio: 'https://drive.google.com/file/d/6'
    },
    createdAt: Date.now() - 3000000
  }
];

// --- Components ---

const Badge = ({ children, variant = 'public' }: { children: React.ReactNode, variant?: 'public' | 'subscriber' }) => (
  <span className={cn(
    "badge",
    variant === 'subscriber' ? "badge-subscriber" : "badge-public"
  )}>
    {children}
  </span>
);

const LessonCard = ({ lesson }: { lesson: Lesson }) => {
  return (
    <div className="lesson-card flex flex-col h-full">
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
        
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{lesson.title}</h3>
        
        <div className="flex items-center gap-2 text-slate-600 mb-4">
          <User size={16} className="text-primary" />
          <span className="text-sm font-medium">{lesson.lecturer}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {lesson.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
        {lesson.links.video && (
          <a 
            href={lesson.links.video} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Video size={20} />
            <span className="text-[10px] font-bold">וידאו</span>
          </a>
        )}
        {lesson.links.audio && (
          <a 
            href={lesson.links.audio} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <Mic size={20} />
            <span className="text-[10px] font-bold">אודיו</span>
          </a>
        )}
        {lesson.links.text && (
          <a 
            href={lesson.links.text} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            <FileText size={20} />
            <span className="text-[10px] font-bold">סיכום</span>
          </a>
        )}
      </div>
    </div>
  );
};

// --- Pages ---

const HomePage = ({ lessons }: { lessons: Lesson[] }) => {
  const [search, setSearch] = useState('');
  const [lecturerFilter, setLecturerFilter] = useState('הכל');
  const [categoryFilter, setCategoryFilter] = useState('הכל');
  const [typeFilter, setTypeFilter] = useState('הכל');

  const lecturers = useMemo(() => ['הכל', ...Array.from(new Set(lessons.map(l => l.lecturer)))], [lessons]);
  const categories = useMemo(() => ['הכל', ...Array.from(new Set(lessons.map(l => l.category)))], [lessons]);

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const matchesSearch = l.title.includes(search) || l.lecturer.includes(search) || l.tags.some(t => t.includes(search));
      const matchesLecturer = lecturerFilter === 'הכל' || l.lecturer === lecturerFilter;
      const matchesCategory = categoryFilter === 'הכל' || l.category === categoryFilter;
      const matchesType = typeFilter === 'הכל' || 
        (typeFilter === 'וידאו' && l.links.video) || 
        (typeFilter === 'אודיו' && l.links.audio) || 
        (typeFilter === 'טקסט' && l.links.text);
      
      return matchesSearch && matchesLecturer && matchesCategory && matchesType;
    });
  }, [lessons, search, lecturerFilter, categoryFilter, typeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-primary mb-4">פורום הבית היהודי</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          מאגר השיעורים והקורסים של הבית היהודי. כאן תוכלו למצוא שיעורי אמונה, הלכה, פרשת שבוע ועוד ממגוון מרצים.
        </p>
      </header>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="חיפוש שיעור, מרצה או נושא..." 
              className="input-field pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div>
            <select 
              className="input-field appearance-none bg-no-repeat bg-[left_1rem_center]"
              value={lecturerFilter}
              onChange={(e) => setLecturerFilter(e.target.value)}
            >
              <option disabled value="">בחר מרצה</option>
              {lecturers.map(l => <option key={l} value={l}>{l === 'הכל' ? 'כל המרצים' : l}</option>)}
            </select>
          </div>

          <div>
            <select 
              className="input-field appearance-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option disabled value="">בחר קטגוריה</option>
              {categories.map(c => <option key={c} value={c}>{c === 'הכל' ? 'כל הקטגוריות' : c}</option>)}
            </select>
          </div>

          <div>
            <select 
              className="input-field appearance-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="הכל">כל סוגי התוכן</option>
              <option value="וידאו">וידאו</option>
              <option value="אודיו">אודיו</option>
              <option value="טקסט">סיכומי טקסט</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FolderOpen className="text-primary" />
          שיעורים זמינים ({filteredLessons.length})
        </h2>
        <Link to="/admin/login" className="text-sm text-slate-500 hover:text-primary flex items-center gap-1">
          <Lock size={14} />
          כניסת מנהל
        </Link>
      </div>

      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200">
          <Search size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-500">לא נמצאו שיעורים התואמים את החיפוש</h3>
          <button 
            onClick={() => {setSearch(''); setLecturerFilter('הכל'); setCategoryFilter('הכל'); setTypeFilter('הכל');}}
            className="mt-4 text-primary font-bold hover:underline"
          >
            נקה את כל המסננים
          </button>
        </div>
      )}
    </div>
  );
};

const AdminLoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === '1234') {
      onLogin();
      navigate('/admin/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold">כניסת מנהל</h2>
          <p className="text-slate-500">הזן סיסמה כדי לנהל את השיעורים</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">סיסמה</label>
            <input 
              type="password" 
              className={cn("input-field", error && "border-red-500")}
              value={pass}
              onChange={(e) => {setPass(e.target.value); setError(false);}}
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1">סיסמה שגויה, נסה שוב</p>}
          </div>
          <button type="submit" className="btn-primary w-full py-3">
            <LogIn size={20} />
            התחברות
          </button>
          <Link to="/" className="block text-center text-sm text-slate-500 hover:underline">חזרה לאתר</Link>
        </form>
      </div>
    </div>
  );
};

const AdminDashboardPage = ({ lessons, setLessons, onLogout }: { lessons: Lesson[], setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>, onLogout: () => void }) => {
  const [isEditing, setIsEditing] = useState<Lesson | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את השיעור?')) {
      setLessons(prev => prev.filter(l => l.id !== id));
    }
  };

  const LessonForm = ({ initialData, onSave, onCancel }: { initialData?: Lesson, onSave: (data: Partial<Lesson>) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<Partial<Lesson>>(initialData || {
      title: '',
      lecturer: '',
      category: '',
      tags: [],
      isSubscriberOnly: false,
      links: { video: '', audio: '', text: '' }
    });
    const [tagInput, setTagInput] = useState('');

    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
          <h3 className="text-2xl font-bold mb-6">{initialData ? 'עריכת שיעור' : 'הוספת שיעור חדש'}</h3>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">כותרת השיעור</label>
                <input 
                  required
                  className="input-field" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">מרצה</label>
                <input 
                  required
                  className="input-field" 
                  value={formData.lecturer} 
                  onChange={e => setFormData({...formData, lecturer: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">קטגוריה</label>
                <input 
                  required
                  className="input-field" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">תגיות (הפרד בפסיקים)</label>
              <input 
                className="input-field" 
                value={tagInput || formData.tags?.join(', ')} 
                onChange={e => {
                  setTagInput(e.target.value);
                  setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)});
                }}
                placeholder="אמונה, הלכה, שבת..."
              />
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <ExternalLink size={16} />
                קישורים לדרייב
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2">
                  <Video size={18} className="text-blue-600 shrink-0" />
                  <input 
                    placeholder="קישור לוידאו" 
                    className="input-field text-sm" 
                    value={formData.links?.video} 
                    onChange={e => setFormData({...formData, links: {...formData.links, video: e.target.value}})}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Mic size={18} className="text-amber-600 shrink-0" />
                  <input 
                    placeholder="קישור לאודיו" 
                    className="input-field text-sm" 
                    value={formData.links?.audio} 
                    onChange={e => setFormData({...formData, links: {...formData.links, audio: e.target.value}})}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-emerald-600 shrink-0" />
                  <input 
                    placeholder="קישור לסיכום טקסט" 
                    className="input-field text-sm" 
                    value={formData.links?.text} 
                    onChange={e => setFormData({...formData, links: {...formData.links, text: e.target.value}})}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <input 
                type="checkbox" 
                id="subOnly"
                className="w-5 h-5 accent-amber-600"
                checked={formData.isSubscriberOnly}
                onChange={e => setFormData({...formData, isSubscriberOnly: e.target.checked})}
              />
              <label htmlFor="subOnly" className="font-medium text-amber-900 cursor-pointer">שיעור למנויים בלבד</label>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1 py-3">שמור שיעור</button>
              <button type="button" onClick={onCancel} className="btn-secondary flex-1 py-3">ביטול</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">ניהול שיעורים</h1>
          <p className="text-slate-500">הוספה, עריכה ומחיקה של תכנים באתר</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAdding(true)} className="btn-primary">
            <Plus size={20} />
            שיעור חדש
          </button>
          <button onClick={() => {onLogout(); navigate('/');}} className="btn-secondary">
            <LogOut size={20} />
            התנתקות
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700">שיעור</th>
                <th className="px-6 py-4 font-bold text-slate-700">מרצה</th>
                <th className="px-6 py-4 font-bold text-slate-700">קטגוריה</th>
                <th className="px-6 py-4 font-bold text-slate-700">סוגי קבצים</th>
                <th className="px-6 py-4 font-bold text-slate-700">גישה</th>
                <th className="px-6 py-4 font-bold text-slate-700">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lessons.map(lesson => (
                <tr key={lesson.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{lesson.title}</td>
                  <td className="px-6 py-4 text-slate-600">{lesson.lecturer}</td>
                  <td className="px-6 py-4 text-slate-600">{lesson.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {lesson.links.video && <Video size={16} className="text-blue-600" />}
                      {lesson.links.audio && <Mic size={16} className="text-amber-600" />}
                      {lesson.links.text && <FileText size={16} className="text-emerald-600" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={lesson.isSubscriberOnly ? 'subscriber' : 'public'}>
                      {lesson.isSubscriberOnly ? 'מנויים' : 'ציבורי'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsEditing(lesson)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lesson.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <LessonForm 
          onCancel={() => setIsAdding(false)}
          onSave={(data) => {
            const newLesson: Lesson = {
              ...data as Lesson,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: Date.now()
            };
            setLessons([newLesson, ...lessons]);
            setIsAdding(false);
          }}
        />
      )}

      {isEditing && (
        <LessonForm 
          initialData={isEditing}
          onCancel={() => setIsEditing(null)}
          onSave={(data) => {
            setLessons(lessons.map(l => l.id === isEditing.id ? { ...l, ...data } : l));
            setIsEditing(null);
          }}
        />
      )}
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

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('jhome_admin', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('jhome_admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">
              ה
            </div>
            <span className="font-black text-xl tracking-tight hidden sm:block">פורום הבית היהודי</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link to="/admin/dashboard" className="btn-primary text-sm py-2">
                <FolderOpen size={18} />
                ניהול
              </Link>
            ) : (
              <Link to="/admin/login" className="text-slate-500 hover:text-primary transition-colors">
                <Lock size={20} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<HomePage lessons={lessons} />} />
          <Route path="/admin/login" element={<AdminLoginPage onLogin={handleLogin} />} />
          <Route 
            path="/admin/dashboard" 
            element={isLoggedIn ? <AdminDashboardPage lessons={lessons} setLessons={setLessons} onLogout={handleLogout} /> : <Navigate to="/admin/login" />} 
          />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            ה
          </div>
          <h3 className="font-bold text-slate-900 mb-2">פורום הבית היהודי</h3>
          <p className="text-slate-500 text-sm mb-6">כל הזכויות שמורות © {new Date().getFullYear()}</p>
          <div className="flex justify-center gap-6 text-slate-400">
            <a href="#" className="hover:text-primary transition-colors">אודות</a>
            <a href="#" className="hover:text-primary transition-colors">צור קשר</a>
            <a href="#" className="hover:text-primary transition-colors">תנאי שימוש</a>
          </div>
        </div>
      </footer>
    </div>
  );
}