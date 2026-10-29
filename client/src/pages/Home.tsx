import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  AudioLines,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coffee,
  Crown,
  Flame,
  Gamepad2,
  GraduationCap,
  Headphones,
  HeartPulse,
  Languages,
  LayoutDashboard,
  Lightbulb,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Mic2,
  Play,
  Plus,
  Quote,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TimerReset,
  Trophy,
  UserRound,
  Volume2,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";

type TabId =
  | "overview"
  | "chat"
  | "detective"
  | "drama"
  | "rpg"
  | "flashcards"
  | "shadowing";
type Persona = "Prof. Park" | "Min-jun" | "K-Pop Idol";
type Level = "Beginner" | "Elementary" | "Intermediate" | "Advanced TOPIK";
type Goal = "TOPIK Exam" | "K-Drama & Music" | "Travel & Everyday Life" | "Business";
type Commitment = "10 min" | "20 min" | "45 min";

const tabs: { id: TabId; label: string; short: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", short: "Home", icon: LayoutDashboard },
  { id: "chat", label: "AI KakaoTalk", short: "Chat", icon: MessageCircle },
  { id: "detective", label: "Error Detective", short: "Fix", icon: CircleHelp },
  { id: "drama", label: "K-Drama Analyzer", short: "Drama", icon: Play },
  { id: "rpg", label: "Seoul Survival RPG", short: "RPG", icon: Gamepad2 },
  { id: "flashcards", label: "3D Flashcards", short: "Cards", icon: BookOpen },
  { id: "shadowing", label: "Shadowing Studio", short: "Voice", icon: Mic2 },
];

const personaData: Record<Persona, { accent: string; avatar: string; role: string; intro: string; tone: string }> = {
  "Prof. Park": {
    accent: "formal",
    avatar: "박",
    role: "Korean Grammar Coach",
    intro: "안녕하세요. 오늘은 존댓말의 시간 표현을 정확히 연습해 봅시다.",
    tone: "Kiên nhẫn, chuẩn mực, giải thích sâu",
  },
  "Min-jun": {
    accent: "casual",
    avatar: "민",
    role: "Your Seoul Buddy",
    intro: "야, 오늘 뭐 해? 한국어로 편하게 말해 보자!",
    tone: "Tự nhiên, vui vẻ, dùng 반말 hiện đại",
  },
  "K-Pop Idol": {
    accent: "idol",
    avatar: "★",
    role: "Your Hype Coach",
    intro: "안녕! 오늘도 같이 한 단계 더 올라가 보자! 화이팅!",
    tone: "Năng lượng, động viên, biểu cảm",
  },
};

const promptData: Record<Persona, { label: string; korean: string; translation: string; note: string }[]> = {
  "Prof. Park": [
    { label: "Hỏi cách nói lịch sự", korean: "주말에 무엇을 하십니까?", translation: "Cuối tuần bạn làm gì ạ?", note: "무엇을 하십니까? là mẫu hỏi trang trọng, phù hợp với người lớn tuổi hoặc môi trường công việc." },
    { label: "Luyện đuôi câu", korean: "저는 베트남에서 왔습니다.", translation: "Tôi đến từ Việt Nam.", note: "왔습니다 kết thúc bằng -습니다, tạo sắc thái trang trọng và chắc chắn." },
    { label: "Nhờ giải thích", korean: "이 문장의 조사를 설명해 주세요.", translation: "Hãy giải thích trợ từ trong câu này giúp tôi.", note: "-아/어 주세요 diễn đạt lời nhờ lịch sự; 주세요 đứng sau động từ hành động." },
  ],
  "Min-jun": [
    { label: "Bắt chuyện casual", korean: "오늘 뭐 먹을래?", translation: "Hôm nay muốn ăn gì?", note: "먹을래? là cách rủ rê thân mật. Dùng với bạn bè, không dùng với sếp nhé!" },
    { label: "Nói 'đỉnh quá'", korean: "대박! 진짜 맛있다.", translation: "Đỉnh quá! Ngon thật đấy.", note: "대박 là slang thể hiện sự ngạc nhiên tích cực, rất thường gặp trong hội thoại và phim Hàn." },
    { label: "Rủ đi chơi", korean: "이번 주말에 같이 갈래?", translation: "Cuối tuần này đi cùng nhau không?", note: "-ㄹ래? tạo cảm giác thân thiện, như một lời rủ nhẹ nhàng giữa bạn bè." },
  ],
  "K-Pop Idol": [
    { label: "Tự động viên", korean: "오늘도 포기하지 말고 화이팅!", translation: "Hôm nay cũng đừng bỏ cuộc, cố lên!", note: "-지 말고 nối hai ý: đừng làm A mà hãy làm B. 화이팅 là năng lượng cổ vũ quen thuộc." },
    { label: "Khen nỗ lực", korean: "정말 잘하고 있어요!", translation: "Bạn đang làm rất tốt!", note: "-고 있어요 mô tả hành động đang diễn ra; câu này nhấn mạnh tiến bộ hiện tại của bạn." },
    { label: "Kết thúc buổi học", korean: "다음에 또 만나요!", translation: "Lần sau lại gặp nhé!", note: "또 만나요 mang sắc thái ấm áp, thường dùng khi tạm biệt và hẹn gặp lại." },
  ],
};

const errorPresets = [
  { id: "particle", label: "Particles", input: "저는 한국어를 공부가 좋아해요", wrong: "공부가", correct: "공부하는 것이", fixed: "저는 한국어를 공부하는 것이 좋아해요", rule: "Trong tiếng Việt, 'tôi thích việc học tiếng Hàn' có thể nối danh từ trực tiếp. Trong tiếng Hàn, động từ 공부하다 cần biến thành mệnh đề danh từ 공부하는 것 rồi mới dùng 좋아하다." },
  { id: "spacing", label: "Spacing", input: "오늘날씨가좋아요", wrong: "오늘날씨가좋아요", correct: "오늘 날씨가 좋아요", fixed: "오늘 날씨가 좋아요", rule: "Tiếng Hàn viết cách giữa các cụm từ. Hãy tách 오늘 (hôm nay) + 날씨 (thời tiết) + 가 (trợ từ) + 좋아요 (tốt)." },
  { id: "honorific", label: "Honorific", input: "선생님이 밥 먹었어", wrong: "먹었어", correct: "드셨어요", fixed: "선생님이 밥을 드셨어요", rule: "Khi chủ thể là thầy cô hoặc người cần kính trọng, dùng động từ kính ngữ 드시다 thay cho 먹다 và đuôi lịch sự -어요." },
];

const flashcards = [
  { hangul: "설레다", roman: "seol-le-da", meaning: "Rung động / háo hức", hanja: "心 (tâm) + 움직이다 (lay động)", example: "새로운 시작이 설레요.", vi: "Mình thấy háo hức cho một khởi đầu mới.", tone: "Cảm xúc" },
  { hangul: "눈치", roman: "nun-chi", meaning: "Ý tứ / khả năng đọc tình huống", hanja: "눈 (mắt) + 치 (cảm nhận)", example: "한국에서는 눈치가 중요해요.", vi: "Ở Hàn Quốc, sự tinh ý rất quan trọng.", tone: "Văn hóa" },
  { hangul: "챙기다", roman: "chaeng-gi-da", meaning: "Chuẩn bị / chăm lo", hanja: "—", example: "우산 꼭 챙기세요.", vi: "Nhớ mang theo ô nhé.", tone: "Đời sống" },
];

const dramaData = [
  { id: "goblin", title: "Goblin", meta: "K-drama · 2016", color: "#7c3aed", quote: "너를 사랑하고 있어.", vi: "Anh đang yêu em.", level: "반말 · Intimate", context: "Câu nói dùng đuôi thân mật để thể hiện mối quan hệ rất gần gũi. Với người Việt, sắc thái này gần với cách xưng hô đã thân thiết chứ không chỉ đơn giản là 'nói suồng sã'.", words: ["사랑하다 · yêu", "-고 있다 · đang", "너 · em/cậu"] },
  { id: "cloy", title: "Crash Landing on You", meta: "K-drama · 2019", color: "#0ea5e9", quote: "괜찮아요. 내가 지켜줄게요.", vi: "Không sao đâu. Tôi sẽ bảo vệ em.", level: "존댓말 → warm", context: "존댓말 tạo khoảng cách lịch sự ban đầu, nhưng -ㄹ게요 khiến lời hứa nghe mềm và chủ động. Đây là kiểu câu rất hay để đọc subtext trong các mối quan hệ Hàn Quốc.", words: ["괜찮다 · ổn", "지키다 · bảo vệ", "-ㄹ게요 · tôi sẽ"] },
  { id: "bts", title: "BTS · Spring Day", meta: "K-pop · Lyric", color: "#f59e0b", quote: "보고 싶다.", vi: "Nhớ bạn / muốn gặp bạn.", level: "반말 · Emotional", context: "Không có chủ ngữ là đặc trưng thơ ca Hàn Quốc. Một câu ngắn có thể bao hàm 'tớ nhớ cậu', 'tôi nhớ bạn' hoặc một người đã xa.", words: ["보다 · gặp/nhìn", "-고 싶다 · muốn", "ẩn chủ ngữ · cảm xúc"] },
];

const rpgChoices = [
  { korean: "티머니 카드 하나 주세요.", vi: "Cho tôi một thẻ T-money.", delta: 10, tag: "Tự nhiên", feedback: "Tuyệt! 하나 주세요 là cách gọi số lượng + 주세요 rất tự nhiên khi mua đồ. Thêm 이요 ở cuối nếu muốn nghe mềm hơn.", good: true },
  { korean: "티머니 카드 하나 줘!", vi: "Đưa tôi một thẻ T-money đi!", delta: -16, tag: "Quá thân mật", feedback: "Cẩn thận! 줘 là 반말, không phù hợp khi nói với nhân viên sân bay. Hãy dùng 주세요 để giữ lịch sự.", good: false },
  { korean: "티머니 카드가 어디예요?", vi: "Thẻ T-money ở đâu ạ?", delta: 5, tag: "Gần đúng", feedback: "Gần đúng! Câu này hỏi vị trí của thẻ, không phải yêu cầu mua. Nếu muốn mua, hãy dùng 하나 주세요.", good: true },
];

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function SectionHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: React.ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {action}
    </div>
  );
}

function MetricBar({ value, color = "mint" }: { value: number; color?: "mint" | "violet" | "blue" | "coral" }) {
  return <div className="metric-bar"><span className={`fill ${color}`} style={{ width: `${value}%` }} /></div>;
}

function LogoMark() {
  return <div className="logo-mark"><span className="ear ear-one" /><span className="ear ear-two" /><span className="rabbit-face">•ᴗ•</span></div>;
}

function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [diagnosisStep, setDiagnosisStep] = useState(1);
  const [level, setLevel] = useState<Level>("Elementary");
  const [goal, setGoal] = useState<Goal>("K-Drama & Music");
  const [commitment, setCommitment] = useState<Commitment>("20 min");
  const [chatPersona, setChatPersona] = useState<Persona>("Min-jun");
  const [chatPrompt, setChatPrompt] = useState(0);
  const [chatLog, setChatLog] = useState<{ mine?: boolean; korean: string; vi?: string; time: string }[]>([
    { korean: personaData["Min-jun"].intro, vi: "Chào! Hôm nay mình cùng luyện nói nhé.", time: "09:41" },
  ]);
  const [errorId, setErrorId] = useState("particle");
  const [errorText, setErrorText] = useState(errorPresets[0].input);
  const [flashIndex, setFlashIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewState, setReviewState] = useState("Ready to review");
  const [dramaId, setDramaId] = useState("cloy");
  const [energy, setEnergy] = useState(74);
  const [rpgStep, setRpgStep] = useState(0);
  const [rpgFeedback, setRpgFeedback] = useState("Chọn câu trả lời để tiếp tục nhiệm vụ.");
  const [recording, setRecording] = useState(false);
  const [shadowResult, setShadowResult] = useState("Ready when you are");
  const [analyzedText, setAnalyzedText] = useState(errorPresets[0].input);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [savedDrama, setSavedDrama] = useState(false);
  const [scenePlaying, setScenePlaying] = useState(false);
  const [nativeReplay, setNativeReplay] = useState(false);
  const [progressSync, setProgressSync] = useState(false);

  const currentError = errorPresets.find(item => item.id === errorId) ?? errorPresets[0];
  const currentDrama = dramaData.find(item => item.id === dramaId) ?? dramaData[0];
  const currentCard = flashcards[flashIndex];
  const currentPersonaPrompts = promptData[chatPersona];
  const knownError = analyzedText === currentError.input;
  const analyzedCorrection = knownError ? currentError.fixed : analyzedText.replace(/\s+/g, " ").trim();
  const pathLabel = goal === "TOPIK Exam" ? "TOPIK sprint" : goal === "K-Drama & Music" ? "Drama fluency" : goal === "Business" ? "Career Korean" : "Seoul survival";
  const completion = goal === "TOPIK Exam" ? 68 : goal === "Travel & Everyday Life" ? 57 : 62;

  const chooseTab = (tab: TabId) => {
    setActiveTab(tab);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sendChat = (promptIndex: number) => {
    const prompt = currentPersonaPrompts[promptIndex];
    setChatPrompt(promptIndex);
    setChatLog(previous => [
      ...previous,
      { mine: true, korean: prompt.korean, vi: prompt.translation, time: "09:42" },
      { korean: chatPersona === "Min-jun" ? "오, 완전 자연스러워! 한 번 더 말해 볼래?" : chatPersona === "Prof. Park" ? "좋습니다. 문장의 구조가 정확합니다." : "대박! 발음도 정말 좋아요!", vi: prompt.note, time: "09:42" },
    ]);
  };

  const selectErrorPreset = (preset: typeof errorPresets[number]) => {
    setErrorId(preset.id);
    setErrorText(preset.input);
    setAnalyzedText(preset.input);
  };

  const analyzeError = () => {
    setAnalyzedText(errorText.trim() || currentError.input);
  };

  const playFlashAudio = () => {
    setAudioPlaying(true);
    window.setTimeout(() => setAudioPlaying(false), 1200);
  };

  const nextCard = (status: string) => {
    setReviewState(status);
    setFlipped(false);
    setFlashIndex(index => (index + 1) % flashcards.length);
  };

  const handleRpgChoice = (choice: typeof rpgChoices[number]) => {
    setEnergy(value => Math.max(12, Math.min(100, value + choice.delta)));
    setRpgFeedback(choice.feedback);
    setRpgStep(1);
  };

  const startShadowing = () => {
    setRecording(true);
    setShadowResult("Listening… compare your pitch");
    window.setTimeout(() => {
      setRecording(false);
      setShadowResult("94% Match · Pitch dropped slightly on ~입니다");
    }, 1500);
  };

  const renderOverview = () => (
    <div className="page-stack">
      <section className="hero-grid">
        <div className="hero-panel glow-panel">
          <div className="hero-topline"><span className="status-dot" /> YOUR PERSONAL LEARNING OS <span className="muted">/ {level}</span></div>
          <h1>오늘도, <span>한 걸음 더.</span></h1>
          <p className="hero-copy">Học điều bạn cần. Tiến bộ theo cách của bạn. Tokki đang xếp buổi học <strong>{commitment}</strong> cho mục tiêu <strong>{goal}</strong>.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => chooseTab("chat")}><Play size={16} fill="currentColor" /> Continue path <ArrowRight size={15} /></button>
            <button className="ghost-button" onClick={() => setShowOnboarding(true)}><Target size={15} /> Chỉnh mục tiêu</button>
          </div>
          <div className="path-meter"><div className="path-meter-head"><span>Today’s {pathLabel}</span><strong>{completion}%</strong></div><MetricBar value={completion} color="violet" /><div className="path-meter-foot"><span>3 missions · 12 XP left</span><span>Streak protected</span></div></div>
        </div>
        <div className="focus-card">
          <div className="focus-card-head"><div><div className="eyebrow">NEXT UP · 08 MIN</div><h3>Shadow the scene</h3></div><div className="mini-icon mint"><AudioLines size={18} /></div></div>
          <p>“괜찮아요. 내가 지켜줄게요.”</p>
          <div className="quote-translation">Không sao đâu. Tôi sẽ bảo vệ em.</div>
          <div className="wave-mini" aria-hidden="true">{Array.from({ length: 34 }).map((_, index) => <i key={index} style={{ height: `${18 + ((index * 17) % 38)}%` }} />)}</div>
          <button className="text-button" onClick={() => chooseTab("shadowing")}>Open Shadowing Studio <ChevronRight size={15} /></button>
        </div>
      </section>

      <section className="stat-grid">
        <div className="stat-card"><div className="stat-icon orange"><Flame size={17} /></div><div><span>Current streak</span><strong>12 <small>days</small></strong><em>+2 from last week</em></div></div>
        <div className="stat-card"><div className="stat-icon violet"><Zap size={17} /></div><div><span>Tokki XP</span><strong>2,480</strong><em>+160 this week</em></div></div>
        <div className="stat-card"><div className="stat-icon blue"><Trophy size={17} /></div><div><span>TOPIK readiness</span><strong>68<small>%</small></strong><em>On track · 4d ahead</em></div></div>
        <div className="stat-card"><div className="stat-icon mint"><HeartPulse size={17} /></div><div><span>Smart review</span><strong>24</strong><em>cards due today</em></div></div>
      </section>

      <section className="content-grid overview-grid">
        <div className="glass-card growth-card">
          <SectionHeading eyebrow="GROWTH MAP" title="Your signal is getting stronger" detail="Tiến bộ theo kỹ năng · cập nhật hôm nay" action={<button className={classNames("icon-button", progressSync && "active")} aria-label="Refresh progress" onClick={() => { setProgressSync(true); window.setTimeout(() => setProgressSync(false), 900); }}><RefreshCw size={15} /></button>} />
          <div className="growth-layout">
            <div className="radar-wrap"><div className="radar-grid" /><div className="radar-shape" /><div className="radar-label radar-top">LISTENING<br /><b>74</b></div><div className="radar-label radar-right">SPEAKING<br /><b>61</b></div><div className="radar-label radar-bottom">GRAMMAR<br /><b>68</b></div><div className="radar-label radar-left">VOCAB<br /><b>82</b></div></div>
            <div className="growth-legend"><div><span className="legend-dot mint" />Vocabulary <strong>82%</strong></div><MetricBar value={82} color="mint" /><div><span className="legend-dot violet" />Grammar <strong>68%</strong></div><MetricBar value={68} color="violet" /><div><span className="legend-dot blue" />Speaking <strong>61%</strong></div><MetricBar value={61} color="blue" /><div><span className="legend-dot coral" />Listening <strong>74%</strong></div><MetricBar value={74} color="coral" /></div>
          </div>
        </div>
        <div className="glass-card mission-card">
          <SectionHeading eyebrow="MISSION CONTROL" title="Small wins, stacked" detail="Nhiệm vụ được cá nhân hoá theo mục tiêu của bạn" />
          <div className="mission-list"><button onClick={() => chooseTab("flashcards")}><span className="mission-bullet done"><Check size={13} /></span><span><b>Smart Review</b><small>10 cards · Context pack</small></span><strong>+40 XP</strong></button><button onClick={() => chooseTab("chat")}><span className="mission-bullet current"><MessageCircle size={13} /></span><span><b>Say it naturally</b><small>Chat with Min-jun</small></span><strong>+60 XP</strong></button><button onClick={() => chooseTab("rpg")}><span className="mission-bullet"><MapPin size={13} /></span><span><b>Street Smart</b><small>Order a T-money card</small></span><strong>+80 XP</strong></button></div>
          <div className="mission-footer"><span><Clock3 size={14} /> {commitment} focus block</span><span className="live-badge">LIVE PLAN</span></div>
        </div>
      </section>

      <section className="premium-banner"><div className="premium-orb"><Crown size={22} /></div><div className="premium-copy"><div className="eyebrow">TOKKI PLUS · FOCUS WITHOUT LIMITS</div><h3>Turn every “what if?” into a real conversation.</h3><p>Unlimited AI KakaoTalk · 1-on-1 TOPIK Mock Grading · custom drama packs</p></div><button className="premium-button" onClick={() => chooseTab("chat")}>See Premium <ArrowUpRightIcon /></button></section>
    </div>
  );

  const renderChat = () => (
    <div className="page-stack">
      <SectionHeading eyebrow="AI KAKAOTALK CHAT" title="A tutor who matches your energy" detail="Luyện hội thoại thực tế · có bản dịch tiếng Việt ngay lập tức" action={<div className="live-pill"><span className="status-dot" /> AI ONLINE</div>} />
      <div className="chat-layout">
        <div className="persona-rail glass-card"><div className="eyebrow">CHOOSE A GUIDE</div><h3>Who’s in your corner?</h3><div className="persona-list">{(Object.keys(personaData) as Persona[]).map(persona => <button key={persona} className={classNames("persona-button", chatPersona === persona && "selected")} onClick={() => { setChatPersona(persona); setChatLog([{ korean: personaData[persona].intro, vi: persona === "Min-jun" ? "Chào! Hôm nay mình cùng luyện nói nhé." : persona === "Prof. Park" ? "Xin chào. Hãy bắt đầu bài học hôm nay." : "Chào! Cùng tiến bộ nhé!", time: "09:41" }]); }}><span className={`persona-avatar ${personaData[persona].accent}`}>{personaData[persona].avatar}</span><span><b>{persona}</b><small>{personaData[persona].role}</small></span><ChevronRight size={15} /></button>)}</div><div className="persona-note"><Sparkles size={14} /><span>{personaData[chatPersona].tone}</span></div><div className="chat-limit"><span>FREE TOKKI CHAT</span><strong>4 / 5</strong><MetricBar value={80} color="violet" /><small>1 lượt chat còn lại hôm nay</small></div></div>
        <div className="kakao-shell"><div className="kakao-top"><div className="kakao-brand"><span className="kakao-dot" />KakaoTalk <small>practice room</small></div><Wifi size={15} /></div><div className="kakao-profile"><span className={`persona-avatar ${personaData[chatPersona].accent}`}>{personaData[chatPersona].avatar}</span><div><b>{chatPersona}</b><small>{personaData[chatPersona].role}</small></div><span className="profile-online">online</span></div><div className="chat-stream"><div className="day-divider"><span>THU · OCT 28</span></div>{chatLog.map((message, index) => <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={`${message.time}-${index}`} className={classNames("chat-message-row", message.mine && "mine")}><div className="chat-bubble"><span className="bubble-korean">{message.korean}</span>{message.vi && <span className="bubble-vi">{message.vi}</span>}<small>{message.time}</small></div></motion.div>)}<div className="typing-indicator"><span /><span /><span /> {chatPersona} is composing</div></div><div className="chat-prompts"><div className="eyebrow">TRY A PROMPT</div><div className="prompt-scroll">{currentPersonaPrompts.map((prompt, index) => <button key={prompt.label} className={chatPrompt === index ? "prompt-chip active" : "prompt-chip"} onClick={() => sendChat(index)}>{prompt.label}<ChevronRight size={13} /></button>)}</div><div className="chat-input"><span>Type in Korean…</span><button onClick={() => sendChat(0)} aria-label="Send"><Send size={15} /></button></div></div></div>
      </div>
      <div className="grammar-callout"><div className="callout-icon"><Lightbulb size={18} /></div><div><div className="eyebrow">INSTANT GRAMMAR NOTE · FROM {chatPersona.toUpperCase()}</div><p>{currentPersonaPrompts[chatPrompt].note}</p></div><button className="ghost-button" onClick={() => chooseTab("detective")}>Practice this <ArrowRight size={14} /></button></div>
    </div>
  );

  const renderDetective = () => (
    <div className="page-stack">
      <SectionHeading 
      eyebrow="ERROR DETECTIVE" 
      title="Turn mistakes into shortcuts" 
      detail="Nhập câu tiếng Hàn — Tokki sẽ soi từng chi tiết cho bạn." 
      action={<div className="tool-status"><ShieldCheck size={15} /> Vietnamese-first feedback</div>} />
      <div className="detective-layout">
        <div className="glass-card detective-input">
          <div className="card-topline"><div>
            <div className="eyebrow">1 · PASTE YOUR SENTENCE</div>
            <h3>What feels off?</h3>
            </div>
            <span className="kbd">⌘ ↵</span>
            </div>
            <div className="preset-row">{errorPresets.map(preset => <button key={preset.id} className={errorId === preset.id ? "preset-chip active" : "preset-chip"} onClick={() => selectErrorPreset(preset)}>{preset.label}</button>)}</div><textarea value={errorText} onChange={event => setErrorText(event.target.value)} spellCheck={false} /><div className="input-foot"><span><Languages size={14} /> Korean input · {errorText.length} chars</span><button className="primary-button small" onClick={analyzeError}>Analyze sentence <Sparkles size={14} /></button></div></div><div className="glass-card diff-card"><div className="card-topline"><div><div className="eyebrow">2 · VISUAL DIFF</div><h3>See the upgrade</h3></div><span className="accuracy-pill"><CheckCircle2 size={14} /> clear fix</span></div><div className="diff-block"><div className="diff-label bad"><span className="diff-dot" />YOUR VERSION</div><p>{knownError ? <>{currentError.input.split(currentError.wrong)[0]}<mark className="wrong">{currentError.wrong}</mark>{currentError.input.split(currentError.wrong).slice(1).join(currentError.wrong)}</> : <mark className="wrong">{analyzedText || "—"}</mark>}</p></div><div className="diff-arrow"><ArrowRight size={16} /></div><div className="diff-block good"><div className="diff-label good"><span className="diff-dot" />NATURAL KOREAN</div><p>{analyzedCorrection || "Nhập một câu để Tokki phân tích."}</p></div><div className="diff-summary"><span>Correction</span><strong>{knownError ? currentError.correct : "Sentence scan ready"}</strong></div></div></div><div className="why-card"><div className="why-number">WHY<br />?</div><div><div className="eyebrow">THE KOREAN LOGIC · GIẢI THÍCH BẰNG TIẾNG VIỆT</div><h3>Different language, different instinct.</h3><p>{knownError ? currentError.rule : "Tokki đã chuẩn hoá khoảng trắng trong câu bạn nhập. Chọn một preset để xem giải thích ngữ pháp chi tiết bằng tiếng Việt."}</p></div><div className="why-decoration">✦</div></div></div>
  );

  const renderDrama = () => (
    <div className="page-stack"><SectionHeading eyebrow="K-DRAMA & K-POP CONTEXTUALIZER" title="Learn the line behind the line" detail="Bắt được sắc thái văn hoá, không chỉ đọc được phụ đề." action={<button className="ghost-button" onClick={() => setSavedDrama(value => !value)}>{savedDrama ? <Check size={14} /> : <BookOpen size={14} />} {savedDrama ? "Saved" : "Save scene"}</button>} /><div className="drama-tabs">{dramaData.map(item => <button key={item.id} onClick={() => setDramaId(item.id)} className={dramaId === item.id ? "drama-tab active" : "drama-tab"}><span style={{ background: item.color }}>{item.title.split(" ").map(word => word[0]).join("")}</span><div><b>{item.title}</b><small>{item.meta}</small></div><ChevronRight size={15} /></button>)}</div><div className="drama-feature" style={{ "--scene-color": currentDrama.color } as React.CSSProperties}><div className="scene-backdrop"><div className="scene-grid" /><span className="scene-label">SCENE 04:17</span><Quote size={30} className="quote-icon" /><div className="scene-quote"><p>{currentDrama.quote}</p><span>{currentDrama.vi}</span></div><button className="scene-play" onClick={() => setScenePlaying(value => !value)} aria-label="Play scene">{scenePlaying ? <span className="scene-pause">Ⅱ</span> : <Play size={18} fill="currentColor" />}</button></div><div className="scene-breakdown"><div className="eyebrow">CONTEXT BREAKDOWN</div><div className="formality-line"><span>FORMALITY</span><strong>{currentDrama.level}</strong></div><p>{currentDrama.context}</p><div className="word-tags">{currentDrama.words.map(word => <span key={word}>{word}</span>)}</div><div className="scene-action"><button className="primary-button small" onClick={() => chooseTab("shadowing")}><Mic2 size={14} /> Shadow this line</button><span><Volume2 size={15} /> Native audio ready</span></div></div></div></div>
  );

  const renderRpg = () => (
    <div className="page-stack"><SectionHeading eyebrow="STREET SMART · SEOUL SURVIVAL RPG" title="Make the right move in Seoul" detail="Một tình huống. Ba lựa chọn. Kỹ năng dùng được ngay ngoài đời." action={<div className="energy-chip"><HeartPulse size={15} /> Energy <b>{energy}</b></div>} /><div className="rpg-layout"><div className="rpg-story glass-card"><div className="rpg-map"><div className="map-scan" /><span><MapPin size={15} /> INCHEON AIRPORT · T1</span><b>MISSION 01 / 03</b></div><div className="story-content"><div className="story-kicker"><PlaneIcon /> ARRIVAL PROTOCOL</div><h3>T-money, please.</h3><p>Bạn vừa đáp xuống Seoul. Trước khi lên AREX, bạn cần mua một thẻ T-money ở quầy tiện lợi. Nhân viên nhìn bạn chờ câu trả lời.</p><div className="npc-line"><span className="npc-avatar">CS</span><span><small>STAFF</small><b>어떤 카드가 필요하세요?</b><em>Bạn cần loại thẻ nào ạ?</em></span></div><div className="energy-track"><div><span>Motivation / Energy</span><strong>{energy}%</strong></div><MetricBar value={energy} color={energy < 45 ? "coral" : "mint"} /></div></div></div><div className="choice-panel"><div className="eyebrow">YOUR RESPONSE · CHOOSE WISELY</div>{rpgChoices.map((choice, index) => <button key={choice.korean} onClick={() => handleRpgChoice(choice)} className={classNames("choice-card", rpgStep === 1 && "answered", rpgFeedback === choice.feedback && "selected")}><span className="choice-number">0{index + 1}</span><span><b>{choice.korean}</b><small>{choice.vi}</small></span><span className={choice.delta > 0 ? "choice-delta positive" : "choice-delta negative"}>{choice.delta > 0 ? "+" : ""}{choice.delta} energy</span></button>)}<AnimatePresence mode="wait"><motion.div key={rpgFeedback} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rpg-feedback"><div className="feedback-icon"><Lightbulb size={16} /></div><div><span className="eyebrow">TOKKI COACH</span><p>{rpgFeedback}</p></div></motion.div></AnimatePresence><button className="next-mission" onClick={() => { setRpgStep(0); setRpgFeedback("Chọn câu trả lời để tiếp tục nhiệm vụ."); setEnergy(74); }}><RotateCcw size={14} /> Reset mission</button></div></div></div>
  );

  const renderFlashcards = () => (
    <div className="page-stack"><SectionHeading eyebrow="3D VOCABULARY SYSTEM" title="Remember it in context" detail="Lật thẻ, nghe âm thanh, rồi đánh giá để Smart Review biết bạn cần gì." action={<div className="review-status"><span className="status-dot" /> {reviewState}</div>} /><div className="flash-layout"><div className="flash-stage"><div className={classNames("flashcard-3d", flipped && "is-flipped")} onClick={() => setFlipped(value => !value)}><div className="flash-face flash-front"><div className="flash-top"><span>CONTEXT PACK 04</span><span>{flashIndex + 1} / {flashcards.length}</span></div><div className="flash-center"><span className="flash-tone">{currentCard.tone}</span><h3>{currentCard.hangul}</h3><p>{currentCard.roman}</p><button className="audio-button" onClick={event => { event.stopPropagation(); playFlashAudio(); }}><Volume2 size={18} /><span>{audioPlaying ? "Playing…" : "Play pronunciation"}</span></button></div><div className="flash-hint"><RotateCcw size={14} /> Tap to flip</div></div><div className="flash-face flash-back"><div className="flash-top"><span>VIETNAMESE MEANING</span><span>SMART NOTE</span></div><div className="back-copy"><span className="flash-tone mint">{currentCard.tone}</span><h3>{currentCard.meaning}</h3><div className="hanja-note"><Languages size={14} /> {currentCard.hanja}</div><div className="example-box"><small>EXAMPLE</small><b>{currentCard.example}</b><span>{currentCard.vi}</span></div></div><div className="flash-hint"><RotateCcw size={14} /> Tap to flip back</div></div></div></div><div className="flash-aside glass-card"><div className="eyebrow">SMART REVIEW</div><h3>How did that feel?</h3><p>Đánh giá nhanh để Tokki điều chỉnh khoảng cách ôn tập của bạn.</p><div className="review-buttons"><button onClick={() => nextCard("Easy · pushed back 7d")}><span className="review-emoji">↑</span><b>Too Easy</b><small>Ôn sau 7 ngày</small></button><button onClick={() => nextCard("Soon · due in 2d")}><span className="review-emoji">↺</span><b>Review Soon</b><small>Ôn lại sau 2 ngày</small></button><button onClick={() => nextCard("Again · due tomorrow")}><span className="review-emoji">!</span><b>Got it Wrong</b><small>Ôn lại ngày mai</small></button></div><div className="flash-stats"><div><span>Accuracy this pack</span><strong>78%</strong></div><MetricBar value={78} color="mint" /><div><span>Retention signal</span><strong>Strong</strong></div></div></div></div></div>
  );

  const renderShadowing = () => (
    <div className="page-stack"><SectionHeading eyebrow="SHADOWING STUDIO" title="Sound like yourself, only clearer" detail="So sánh pitch contour để phát âm tự nhiên hơn — không cần đoán." action={<div className="recording-status"><span className={classNames("status-dot", recording && "recording")} /> {recording ? "LISTENING" : "READY TO RECORD"}</div>} /><div className="shadow-layout"><div className="glass-card waveform-card"><div className="wave-header"><div><div className="eyebrow">NATIVE PITCH CONTOUR</div><h3>괜찮아요. 내가 지켜줄게요.</h3></div><span className="wave-time">00:04.7</span></div><div className="waveform native">{Array.from({ length: 68 }).map((_, index) => <i key={index} style={{ height: `${22 + ((index * 29) % 64)}%` }} />)}</div><div className="wave-header learner"><div><div className="eyebrow">LEARNER PITCH CONTOUR <span className="legend-inline"><i /> your voice</span></div><h3>Recording 03 · today</h3></div><span className="match-number">94%</span></div><div className="waveform learner">{Array.from({ length: 68 }).map((_, index) => <i key={index} style={{ height: `${18 + ((index * 23 + 15) % 48)}%` }} />)}</div><div className="wave-legend"><span><i className="native-dot" /> Native</span><span><i className="learner-dot" /> Learner</span><span><AudioLines size={13} /> Pitch contours aligned</span></div></div><div className="glass-card shadow-control"><div className="eyebrow">RECORD & REFLECT</div><div className="mic-orb-wrap"><div className={classNames("mic-orb", recording && "active")}><div className="mic-ring" /><Mic2 size={25} /></div></div><h3>{recording ? "Listening to your rhythm…" : "Ready for another take?"}</h3><p>Đọc câu mẫu bằng nhịp tự nhiên. Tokki sẽ đối chiếu trọng âm và đuôi câu.</p><button className={classNames("record-button", recording && "active")} onClick={startShadowing}>{recording ? "Analyzing…" : "Hold to record"}<span><Mic2 size={15} /></span></button><div className="shadow-result"><CheckCircle2 size={15} /><span>{shadowResult}</span></div></div></div><div className="shadow-insight"><div className="insight-icon"><Sparkles size={17} /></div><div><div className="eyebrow">TOKKI’S TAKE</div><p><strong>Great energy.</strong> Pitch rơi nhẹ ở tiểu từ kết thúc <code>~입니다</code>. Hãy giữ cao độ thêm 0.2 giây để câu nghe tự tin hơn.</p></div><button className="ghost-button" onClick={() => { setNativeReplay(true); window.setTimeout(() => setNativeReplay(false), 1100); }}>{nativeReplay ? "Playing native" : "Replay native"} <Play size={14} /></button></div></div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "chat": return renderChat();
      case "detective": return renderDetective();
      case "drama": return renderDrama();
      case "rpg": return renderRpg();
      case "flashcards": return renderFlashcards();
      case "shadowing": return renderShadowing();
      default: return renderOverview();
    }
  };

  const optionButtons = <>
    {diagnosisStep === 1 && <div className="wizard-options">{(["Beginner", "Elementary", "Intermediate", "Advanced TOPIK"] as Level[]).map(item => <button key={item} onClick={() => setLevel(item)} className={level === item ? "wizard-option selected" : "wizard-option"}><span className="option-index">{item === "Beginner" ? "01" : item === "Elementary" ? "02" : item === "Intermediate" ? "03" : "04"}</span><span><b>{item}</b><small>{item === "Beginner" ? "한글의 첫 걸음" : item === "Elementary" ? "Everyday foundations" : item === "Intermediate" ? "Connect & express" : "TOPIK-ready fluency"}</small></span><span className="option-check">{level === item && <Check size={14} />}</span></button>)}</div>}
    {diagnosisStep === 2 && <div className="wizard-options">{(["TOPIK Exam", "K-Drama & Music", "Travel & Everyday Life", "Business"] as Goal[]).map(item => <button key={item} onClick={() => setGoal(item)} className={goal === item ? "wizard-option selected" : "wizard-option"}><span className="option-icon">{item === "TOPIK Exam" ? <GraduationCap size={17} /> : item === "K-Drama & Music" ? <Play size={17} /> : item === "Travel & Everyday Life" ? <MapPin size={17} /> : <BriefcaseIcon />}</span><span><b>{item}</b><small>{item === "TOPIK Exam" ? "Score with confidence" : item === "K-Drama & Music" ? "Catch every nuance" : item === "Travel & Everyday Life" ? "Speak on the street" : "Open new doors"}</small></span><span className="option-check">{goal === item && <Check size={14} />}</span></button>)}</div>}
    {diagnosisStep === 3 && <div className="commitment-grid">{(["10 min", "20 min", "45 min"] as Commitment[]).map(item => <button key={item} onClick={() => setCommitment(item)} className={commitment === item ? "commit-option selected" : "commit-option"}><Clock3 size={18} /><b>{item}</b><small>{item === "10 min" ? "Keep it light" : item === "20 min" ? "Best daily rhythm" : "Deep dive mode"}</small>{commitment === item && <CheckCircle2 size={16} />}</button>)}</div>}
  </>;

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar"><div className="brand-lockup" onClick={() => chooseTab("overview")}><LogoMark /><div><strong>tokki <span>hangul</span></strong><small>토끼 한글 · KOREAN, YOUR WAY</small></div></div><button className="mobile-menu" onClick={() => setMobileMenu(value => !value)} aria-label="Toggle menu"><Menu size={19} /></button><nav className={classNames("main-nav", mobileMenu && "open")}>{tabs.map(tab => { const Icon = tab.icon; return <button key={tab.id} onClick={() => chooseTab(tab.id)} className={activeTab === tab.id ? "nav-item active" : "nav-item"}><Icon size={15} /><span>{tab.label}</span></button>; })}</nav><div className="header-actions"><button className="diagnosis-button" onClick={() => { setDiagnosisStep(1); setShowOnboarding(true); }}><BrainCircuit size={15} /> Diagnosis</button><div className="header-stat"><Flame size={15} fill="currentColor" /><b>12</b><span>day streak</span></div><div className="header-stat xp"><Zap size={15} fill="currentColor" /><b>2,480</b><span>XP</span></div><div className="profile-chip"><span className="profile-photo">LN</span><span><b>Edilson Mboa</b><small>{level}</small></span><ChevronDown size={14} /></div></div></header>
      <main className="main-content"><div className="breadcrumb"><span>Tokki OS</span><ChevronRight size={13} /><strong>{tabs.find(tab => tab.id === activeTab)?.label}</strong><span className="breadcrumb-pulse">● synced just now</span></div>{renderActiveTab()}</main>
      <footer className="footer-bar"><span><span className="status-dot" /> Tokki Hangul beta</span><span>Learn What You Need — Progress Your Own Way</span><span className="footer-right"><ShieldCheck size={13} /> Built for Vietnamese learners</span></footer>

      <AnimatePresence>{showOnboarding && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="diagnosis-modal" initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }}><button className="modal-close" onClick={() => setShowOnboarding(false)} aria-label="Close"><X size={18} /></button><div className="modal-intro"><div className="modal-logo"><LogoMark /></div><div className="eyebrow">TOKKI SKILL DIAGNOSIS · 01—03</div><h2>Build your Korean path.</h2><p>Không có lộ trình chung. Hãy cho Tokki biết bạn đang ở đâu và muốn đi đâu.</p></div><div className="wizard-progress"><div className="wizard-step active"><span>01</span><b>Level</b></div><i /><div className={diagnosisStep > 1 ? "wizard-step active" : "wizard-step"}><span>02</span><b>Goal</b></div><i /><div className={diagnosisStep > 2 ? "wizard-step active" : "wizard-step"}><span>03</span><b>Rhythm</b></div></div><div className="wizard-question"><div className="eyebrow">{diagnosisStep === 1 ? "WHERE ARE YOU NOW?" : diagnosisStep === 2 ? "WHAT PULLS YOU FORWARD?" : "WHAT CAN YOU COMMIT?"}</div><h3>{diagnosisStep === 1 ? "Chọn level tiếng Hàn hiện tại" : diagnosisStep === 2 ? "Mục tiêu chính của bạn là gì?" : "Nhịp học mỗi ngày của bạn"}</h3>{optionButtons}</div><div className="wizard-footer"><span>Step {diagnosisStep} of 3</span><div><button className="ghost-button" onClick={() => diagnosisStep === 1 ? setShowOnboarding(false) : setDiagnosisStep(step => step - 1)}>{diagnosisStep === 1 ? "Skip for now" : "Back"}</button><button className="primary-button" onClick={() => diagnosisStep < 3 ? setDiagnosisStep(step => step + 1) : setShowOnboarding(false)}>{diagnosisStep < 3 ? "Next step" : "Build my path"}<ArrowRight size={15} /></button></div></div></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}

function ArrowUpRightIcon() { return <ArrowRight size={15} className="arrow-up-right" />; }
function BriefcaseIcon() { return <span className="briefcase-icon">▣</span>; }
function PlaneIcon() { return <span className="plane-icon">✈</span>; }

export default Home;
