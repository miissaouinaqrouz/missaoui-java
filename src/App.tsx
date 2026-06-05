import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Code2,
  Database,
  FileText,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  Menu,
  Network,
  RotateCcw,
  SearchCheck,
  Target,
  Trophy,
  UserRound,
  X,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import './App.css'
import {
  allFlashcards,
  examQuestions,
  modules,
  presentationSheets,
  professorExams,
  type MultiAnswerQuestion,
  type QuizQuestion,
} from './courseData'

type View = 'dashboard' | 'modules' | 'flashcards' | 'exam' | 'professor-exams'
type AnswerMap = Record<string, number>
type MultiAnswerMap = Record<string, number[]>
type Visitor = {
  firstName: string
  lastName: string
  registeredAt?: string
}

const storage = {
  completed: 'spring-platform-completed-modules',
  mastered: 'spring-platform-mastered-cards',
  visitor: 'spring-platform-visitor',
}

function readStoredList(key: string) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function storeList(key: string, value: string[]) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function readStoredVisitor(): Visitor | null {
  try {
    const raw = window.localStorage.getItem(storage.visitor)
    if (!raw) return null
    const visitor = JSON.parse(raw) as Visitor
    return visitor.firstName && visitor.lastName ? visitor : null
  } catch {
    return null
  }
}

function App() {
  const [visitor, setVisitor] = useState<Visitor | null>(() => readStoredVisitor())
  const [view, setView] = useState<View>('dashboard')
  const [activeModuleId, setActiveModuleId] = useState(modules[0].id)
  const [completedModules, setCompletedModules] = useState(() => readStoredList(storage.completed))
  const [masteredCards, setMasteredCards] = useState(() => readStoredList(storage.mastered))
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({})
  const [moduleAnswers, setModuleAnswers] = useState<AnswerMap>({})
  const [examAnswers, setExamAnswers] = useState<AnswerMap>({})
  const [professorAnswers, setProfessorAnswers] = useState<MultiAnswerMap>({})
  const [professorSubmitted, setProfessorSubmitted] = useState<Record<string, boolean>>({})
  const [activeProfessorExamId, setActiveProfessorExamId] = useState(professorExams[0].id)
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeModule = modules.find((module) => module.id === activeModuleId) ?? modules[0]
  const activeProfessorExam =
    professorExams.find((exam) => exam.id === activeProfessorExamId) ?? professorExams[0]
  const completedPercent = Math.round((completedModules.length / modules.length) * 100)
  const masteredPercent = Math.round((masteredCards.length / allFlashcards.length) * 100)
  const examScore = useMemo(() => getScore(examQuestions, examAnswers), [examAnswers])
  const professorScore = useMemo(
    () => getMultiScore(activeProfessorExam.mcq, professorAnswers),
    [activeProfessorExam.mcq, professorAnswers],
  )

  if (!visitor) {
    return (
      <RegistrationGate
        onRegistered={(nextVisitor) => {
          window.localStorage.setItem(storage.visitor, JSON.stringify(nextVisitor))
          setVisitor(nextVisitor)
        }}
      />
    )
  }

  function navigate(nextView: View) {
    setView(nextView)
    setSidebarOpen(false)
  }

  function openModule(moduleId: string) {
    setActiveModuleId(moduleId)
    navigate('modules')
  }

  function toggleModuleDone(moduleId: string) {
    setCompletedModules((current) => {
      const next = current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId]
      storeList(storage.completed, next)
      return next
    })
  }

  function toggleCard(cardId: string) {
    setMasteredCards((current) => {
      const next = current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : [...current, cardId]
      storeList(storage.mastered, next)
      return next
    })
  }

  function resetProgress() {
    setCompletedModules([])
    setMasteredCards([])
    setExamAnswers({})
    setModuleAnswers({})
    setProfessorAnswers({})
    setProfessorSubmitted({})
    setExamSubmitted(false)
    storeList(storage.completed, [])
    storeList(storage.mastered, [])
  }

  return (
    <div className="appShell">
      <aside className={`sidebar ${sidebarOpen ? 'isOpen' : ''}`}>
        <div className="brandBlock">
          <div className="brandMark">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="eyebrow">EHEIO 2026</p>
            <h1>Spring Exam Prep</h1>
          </div>
        </div>

        <nav className="navBlock" aria-label="Navigation principale">
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => navigate('dashboard')}>
            <LayoutDashboard size={18} />
            Accueil
          </button>
          <button className={view === 'modules' ? 'active' : ''} onClick={() => navigate('modules')}>
            <BookOpen size={18} />
            Modules
          </button>
          <button className={view === 'flashcards' ? 'active' : ''} onClick={() => navigate('flashcards')}>
            <Layers3 size={18} />
            Flashcards
          </button>
          <button className={view === 'exam' ? 'active' : ''} onClick={() => navigate('exam')}>
            <ClipboardList size={18} />
            Examen blanc
          </button>
          <button className={view === 'professor-exams' ? 'active' : ''} onClick={() => navigate('professor-exams')}>
            <FileText size={18} />
            Examens prof
          </button>
        </nav>

        <div className="moduleNav">
          <p className="eyebrow">Programme</p>
          {modules.map((module) => (
            <button
              key={module.id}
              className={module.id === activeModuleId ? 'activeModule' : ''}
              onClick={() => openModule(module.id)}
            >
              <span className="moduleDot" style={{ backgroundColor: module.accent }} />
              <span>{module.shortTitle}</span>
              <small>{module.quiz.length}</small>
            </button>
          ))}
        </div>

        <div className="progressPanel">
          <div>
            <span>Progression</span>
            <strong>{completedPercent}%</strong>
          </div>
          <div className="meter">
            <span style={{ width: `${completedPercent}%` }} />
          </div>
        </div>
      </aside>

      <div className="mainShell">
        <header className="topbar">
          <button className="iconButton mobileOnly" onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={20} />
          </button>
          <div>
            <p className="eyebrow">
              {visitor.firstName} {visitor.lastName} · Module Spring, JPA, Hibernate et REST
            </p>
            <h2>{pageTitle(view, activeModule.shortTitle)}</h2>
          </div>
          <button className="iconButton" onClick={resetProgress} aria-label="Réinitialiser la progression">
            <RotateCcw size={19} />
          </button>
        </header>

        <button className={`backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} aria-label="Fermer" />
        <button className={`closeMenu ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu">
          <X size={20} />
        </button>

        <main>
          {view === 'dashboard' && (
            <Dashboard
              completedPercent={completedPercent}
              masteredPercent={masteredPercent}
              examScore={examScore}
              onOpenModule={openModule}
              onNavigate={navigate}
            />
          )}

          {view === 'modules' && (
            <ModulesView
              activeModuleId={activeModuleId}
              completedModules={completedModules}
              moduleAnswers={moduleAnswers}
              onAnswer={(id, answer) => setModuleAnswers((current) => ({ ...current, [id]: answer }))}
              onComplete={toggleModuleDone}
              onOpenModule={openModule}
            />
          )}

          {view === 'flashcards' && (
            <FlashcardsView
              masteredCards={masteredCards}
              revealedCards={revealedCards}
              onReveal={(id) => setRevealedCards((current) => ({ ...current, [id]: !current[id] }))}
              onToggle={toggleCard}
            />
          )}

          {view === 'exam' && (
            <ExamView
              answers={examAnswers}
              submitted={examSubmitted}
              score={examScore}
              onAnswer={(id, answer) => {
                setExamSubmitted(false)
                setExamAnswers((current) => ({ ...current, [id]: answer }))
              }}
              onSubmit={() => setExamSubmitted(true)}
              onReset={() => {
                setExamAnswers({})
                setExamSubmitted(false)
              }}
            />
          )}

          {view === 'professor-exams' && (
            <ProfessorExamsView
              activeExamId={activeProfessorExamId}
              answers={professorAnswers}
              score={professorScore}
              submitted={professorSubmitted[activeProfessorExamId] ?? false}
              onOpenExam={setActiveProfessorExamId}
              onToggleAnswer={(questionId, answer) => {
                setProfessorSubmitted((current) => ({ ...current, [activeProfessorExamId]: false }))
                setProfessorAnswers((current) => toggleMultiAnswer(current, questionId, answer))
              }}
              onSubmit={() =>
                setProfessorSubmitted((current) => ({ ...current, [activeProfessorExamId]: true }))
              }
              onReset={() => {
                const questionIds = activeProfessorExam.mcq.map((question) => question.id)
                setProfessorAnswers((current) =>
                  Object.fromEntries(Object.entries(current).filter(([id]) => !questionIds.includes(id))),
                )
                setProfessorSubmitted((current) => ({ ...current, [activeProfessorExamId]: false }))
              }}
            />
          )}
        </main>
      </div>
    </div>
  )
}

function RegistrationGate({ onRegistered }: { onRegistered: (visitor: Visitor) => void }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'offline' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanFirstName = cleanName(firstName)
    const cleanLastName = cleanName(lastName)

    if (!cleanFirstName || !cleanLastName) {
      setStatus('error')
      setMessage('Nom et prénom sont obligatoires.')
      return
    }

    const nextVisitor = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      registeredAt: new Date().toISOString(),
    }

    setStatus('saving')
    setMessage('Enregistrement en cours...')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextVisitor),
      })

      if (response.ok) {
        setStatus('saved')
        setMessage('Enregistré dans GitHub.')
      } else {
        setStatus('offline')
        setMessage('Enregistré sur ce navigateur. Le push GitHub sera actif après déploiement serveur.')
      }
    } catch {
      setStatus('offline')
      setMessage('Enregistré sur ce navigateur. Le push GitHub sera actif après déploiement serveur.')
    }

    onRegistered(nextVisitor)
  }

  return (
    <main className="registrationPage">
      <section className="registrationPanel">
        <div className="registrationIcon">
          <UserRound size={30} />
        </div>
        <p className="eyebrow">Accès obligatoire</p>
        <h1>Identifiez-vous</h1>
        <p>Entrez votre nom et prénom avant d’accéder à la plateforme de révision.</p>

        <form onSubmit={submit} className="registrationForm">
          <label className="fieldGroup">
            <span>Prénom</span>
            <div className="inputShell">
              <UserRound size={18} />
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                placeholder="Ayoub"
                maxLength={40}
              />
            </div>
          </label>
          <label className="fieldGroup">
            <span>Nom</span>
            <div className="inputShell">
              <UserRound size={18} />
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                placeholder="Missaoui"
                maxLength={40}
              />
            </div>
          </label>
          <button className="primaryButton" disabled={status === 'saving'}>
            <CheckCircle2 size={18} />
            Entrer dans la plateforme
          </button>
        </form>

        {message && <p className={`registrationMessage ${status}`}>{message}</p>}
      </section>
    </main>
  )
}

function cleanName(value: string) {
  return value.replace(/\s+/g, ' ').trim().slice(0, 40)
}

function Dashboard({
  completedPercent,
  masteredPercent,
  examScore,
  onOpenModule,
  onNavigate,
}: {
  completedPercent: number
  masteredPercent: number
  examScore: { correct: number; total: number; percent: number }
  onOpenModule: (id: string) => void
  onNavigate: (view: View) => void
}) {
  return (
    <div className="dashboard">
      <section className="overviewBand">
        <div className="overviewCopy">
          <p className="eyebrow">Plateforme d'apprentissage</p>
          <h2>Spring Core, Data, JPA et REST Boot</h2>
          <p>
            Un parcours de révision basé sur les supports du module, avec notions clés, exemples Java,
            quiz par chapitre, flashcards et examen blanc.
          </p>
          <div className="actionRow">
            <button className="primaryButton" onClick={() => onOpenModule(modules[0].id)}>
              <BookOpen size={18} />
              Commencer
            </button>
            <button className="ghostButton" onClick={() => onNavigate('exam')}>
              <ClipboardList size={18} />
              Examen blanc
            </button>
          </div>
        </div>
        <div className="architectureMap" aria-label="Carte du module">
          <div className="mapNode core">
            <Code2 size={24} />
            Spring Core
          </div>
          <div className="mapLine" />
          <div className="mapNode data">
            <Database size={24} />
            Data & JPA
          </div>
          <div className="mapLine" />
          <div className="mapNode api">
            <Network size={24} />
            REST API
          </div>
        </div>
      </section>

      <section className="statsGrid">
        <Metric title="Modules terminés" value={`${completedPercent}%`} icon={<CheckCircle2 size={20} />} />
        <Metric title="Flashcards maîtrisées" value={`${masteredPercent}%`} icon={<Layers3 size={20} />} />
        <Metric title="Score examen" value={`${examScore.percent}%`} icon={<Trophy size={20} />} />
      </section>

      <section className="moduleGrid">
        {modules.map((module) => (
          <button key={module.id} className="moduleCard" onClick={() => onOpenModule(module.id)}>
            <span className="moduleAccent" style={{ backgroundColor: module.accent }} />
            <span className="moduleMeta">{module.level} · {module.duration}</span>
            <strong>{module.title}</strong>
            <span>{module.summary}</span>
          </button>
        ))}
      </section>
    </div>
  )
}

function ModulesView({
  activeModuleId,
  completedModules,
  moduleAnswers,
  onAnswer,
  onComplete,
  onOpenModule,
}: {
  activeModuleId: string
  completedModules: string[]
  moduleAnswers: AnswerMap
  onAnswer: (id: string, answer: number) => void
  onComplete: (id: string) => void
  onOpenModule: (id: string) => void
}) {
  const activeModule = modules.find((module) => module.id === activeModuleId) ?? modules[0]
  const isDone = completedModules.includes(activeModule.id)

  return (
    <div className="learningLayout">
      <section className="moduleRail">
        {modules.map((module) => (
          <button
            key={module.id}
            className={module.id === activeModule.id ? 'selected' : ''}
            onClick={() => onOpenModule(module.id)}
          >
            <span style={{ backgroundColor: module.accent }} />
            <strong>{module.shortTitle}</strong>
            {completedModules.includes(module.id) && <CheckCircle2 size={16} />}
          </button>
        ))}
      </section>

      <article className="lessonPanel">
        <div className="lessonHeader">
          <div>
            <p className="eyebrow">{activeModule.source}</p>
            <h2>{activeModule.title}</h2>
            <p>{activeModule.summary}</p>
          </div>
          <button className={isDone ? 'doneButton isDone' : 'doneButton'} onClick={() => onComplete(activeModule.id)}>
            <CheckCircle2 size={18} />
            {isDone ? 'Terminé' : 'Marquer terminé'}
          </button>
        </div>

        <div className="lessonSections">
          <section>
            <h3><Target size={18} /> Objectifs</h3>
            <ul>
              {activeModule.objectives.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section>
            <h3><SearchCheck size={18} /> Points clés</h3>
            <ul>
              {activeModule.keyPoints.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="presentationInfo">
            <h3><FileText size={18} /> Infos de la présentation</h3>
            <div className="presentationInfoGrid">
              {(presentationSheets[activeModule.id] ?? []).map((section) => (
                <article key={section.title}>
                  <strong>{section.title}</strong>
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {activeModule.code && (
            <section className="codePanel">
              <h3><Code2 size={18} /> Exemple</h3>
              <pre><code>{activeModule.code}</code></pre>
            </section>
          )}

          <section className="pitfallPanel">
            <h3><ClipboardList size={18} /> Pièges d'examen</h3>
            <ul>
              {activeModule.pitfalls.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </div>

        <QuizBlock questions={activeModule.quiz} answers={moduleAnswers} onAnswer={onAnswer} />
      </article>
    </div>
  )
}

function FlashcardsView({
  masteredCards,
  revealedCards,
  onReveal,
  onToggle,
}: {
  masteredCards: string[]
  revealedCards: Record<string, boolean>
  onReveal: (id: string) => void
  onToggle: (id: string) => void
}) {
  return (
    <section className="flashcardGrid">
      {allFlashcards.map((card) => {
        const revealed = revealedCards[card.id]
        const mastered = masteredCards.includes(card.id)

        return (
          <article key={card.id} className={`flashcard ${revealed ? 'revealed' : ''} ${mastered ? 'mastered' : ''}`}>
            <div className="flashcardTop">
              <span style={{ backgroundColor: card.accent }} />
              <small>{card.moduleTitle}</small>
            </div>
            <button className="flashContent" onClick={() => onReveal(card.id)}>
              <strong>{revealed ? card.back : card.front}</strong>
            </button>
            <button className="miniButton" onClick={() => onToggle(card.id)}>
              <CheckCircle2 size={17} />
              {mastered ? 'Maîtrisée' : 'À revoir'}
            </button>
          </article>
        )
      })}
    </section>
  )
}

function ExamView({
  answers,
  submitted,
  score,
  onAnswer,
  onSubmit,
  onReset,
}: {
  answers: AnswerMap
  submitted: boolean
  score: { correct: number; total: number; percent: number }
  onAnswer: (id: string, answer: number) => void
  onSubmit: () => void
  onReset: () => void
}) {
  return (
    <section className="examPanel">
      <div className="examHeader">
        <div>
          <p className="eyebrow">Banque de questions</p>
          <h2>Examen blanc Spring</h2>
          <p>{examQuestions.length} questions couvrent Spring Core, JDBC, transactions, JPA et REST.</p>
        </div>
        <div className="scoreBadge">
          <strong>{score.percent}%</strong>
          <span>{score.correct}/{score.total}</span>
        </div>
      </div>

      <div className="questionStack">
        {examQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            index={index + 1}
            question={question}
            selected={answers[question.id]}
            locked={submitted}
            onSelect={(answer) => onAnswer(question.id, answer)}
          />
        ))}
      </div>

      <div className="examActions">
        <button className="primaryButton" onClick={onSubmit}>
          <Trophy size={18} />
          Corriger
        </button>
        <button className="ghostButton" onClick={onReset}>
          <RotateCcw size={18} />
          Refaire
        </button>
      </div>
    </section>
  )
}

function ProfessorExamsView({
  activeExamId,
  answers,
  submitted,
  score,
  onOpenExam,
  onToggleAnswer,
  onSubmit,
  onReset,
}: {
  activeExamId: string
  answers: MultiAnswerMap
  submitted: boolean
  score: { correct: number; total: number; percent: number }
  onOpenExam: (id: string) => void
  onToggleAnswer: (questionId: string, answer: number) => void
  onSubmit: () => void
  onReset: () => void
}) {
  const activeExam = professorExams.find((exam) => exam.id === activeExamId) ?? professorExams[0]

  return (
    <div className="professorLayout">
      <section className="professorTabs" aria-label="Sujets proposés par le professeur">
        {professorExams.map((exam) => (
          <button
            key={exam.id}
            className={exam.id === activeExam.id ? 'selected' : ''}
            onClick={() => onOpenExam(exam.id)}
          >
            <FileText size={18} />
            <span>
              <strong>{exam.year}</strong>
              <small>{exam.duration}</small>
            </span>
          </button>
        ))}
      </section>

      <section className="examPanel professorPanel">
        <div className="examHeader">
          <div>
            <p className="eyebrow">{activeExam.source}</p>
            <h2>{activeExam.title}</h2>
            <p>{activeExam.description}</p>
          </div>
          <div className="scoreBadge">
            <strong>{score.percent}%</strong>
            <span>{score.correct}/{score.total}</span>
          </div>
        </div>

        <div className="openExerciseGrid">
          {activeExam.openExercises.map((exercise) => (
            <article key={exercise.title} className="openExercise">
              <h3>{exercise.title}</h3>
              <p>{exercise.prompt}</p>
              {exercise.code && (
                <pre>
                  <code>{exercise.code}</code>
                </pre>
              )}
              <div className="expectedBlock">
                <strong>Réponse attendue</strong>
                <ul>
                  {exercise.expected.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="professorMcqHeader">
          <div className="sectionTitle">
            <ClipboardList size={18} />
            <h3>QCM corrigé</h3>
          </div>
          <p>Choix multiples possibles. La question est correcte seulement si toutes les bonnes réponses sont cochées.</p>
        </div>

        <div className="questionStack">
          {activeExam.mcq.map((question, index) => (
            <MultiQuestionCard
              key={question.id}
              index={index + 1}
              question={question}
              selected={answers[question.id] ?? []}
              locked={submitted}
              onToggle={(answer) => onToggleAnswer(question.id, answer)}
            />
          ))}
        </div>

        <div className="examActions">
          <button className="primaryButton" onClick={onSubmit}>
            <Trophy size={18} />
            Corriger
          </button>
          <button className="ghostButton" onClick={onReset}>
            <RotateCcw size={18} />
            Refaire ce sujet
          </button>
        </div>
      </section>
    </div>
  )
}

function MultiQuestionCard({
  index,
  question,
  selected,
  locked,
  onToggle,
}: {
  index: number
  question: MultiAnswerQuestion
  selected: number[]
  locked: boolean
  onToggle: (answer: number) => void
}) {
  return (
    <article className="questionCard">
      <div className="questionText">
        <span>{index}</span>
        <strong>{question.question}</strong>
      </div>
      <div className="optionGrid">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected.includes(optionIndex)
          const isCorrect = locked && question.answers.includes(optionIndex)
          const isWrong = locked && isSelected && !question.answers.includes(optionIndex)

          return (
            <button
              key={option}
              className={`${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              onClick={() => onToggle(optionIndex)}
            >
              <span className={isSelected ? 'checkBox checked' : 'checkBox'} />
              {option}
            </button>
          )
        })}
      </div>
      {locked && <p className="explanation">{question.explanation}</p>}
    </article>
  )
}

function QuizBlock({
  questions,
  answers,
  onAnswer,
}: {
  questions: QuizQuestion[]
  answers: AnswerMap
  onAnswer: (id: string, answer: number) => void
}) {
  return (
    <section className="quizBlock">
      <div className="sectionTitle">
        <ClipboardList size={18} />
        <h3>Quiz du chapitre</h3>
      </div>
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          index={index + 1}
          question={question}
          selected={answers[question.id]}
          locked={answers[question.id] !== undefined}
          onSelect={(answer) => onAnswer(question.id, answer)}
        />
      ))}
    </section>
  )
}

function QuestionCard({
  index,
  question,
  selected,
  locked,
  onSelect,
}: {
  index: number
  question: QuizQuestion
  selected?: number
  locked: boolean
  onSelect: (answer: number) => void
}) {
  return (
    <article className="questionCard">
      <div className="questionText">
        <span>{index}</span>
        <strong>{question.question}</strong>
      </div>
      <div className="optionGrid">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex
          const isCorrect = locked && optionIndex === question.answer
          const isWrong = locked && isSelected && optionIndex !== question.answer

          return (
            <button
              key={option}
              className={`${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              onClick={() => onSelect(optionIndex)}
            >
              {option}
            </button>
          )
        })}
      </div>
      {locked && selected !== undefined && <p className="explanation">{question.explanation}</p>}
    </article>
  )
}

function Metric({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <article className="metricCard">
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <p>{title}</p>
      </div>
    </article>
  )
}

function getScore(questions: QuizQuestion[], answers: AnswerMap) {
  const correct = questions.filter((question) => answers[question.id] === question.answer).length
  const total = questions.length
  return {
    correct,
    total,
    percent: total ? Math.round((correct / total) * 100) : 0,
  }
}

function getMultiScore(questions: MultiAnswerQuestion[], answers: MultiAnswerMap) {
  const correct = questions.filter((question) => sameAnswers(question.answers, answers[question.id] ?? [])).length
  const total = questions.length
  return {
    correct,
    total,
    percent: total ? Math.round((correct / total) * 100) : 0,
  }
}

function sameAnswers(expected: number[], selected: number[]) {
  const normalizedExpected = [...expected].sort((a, b) => a - b).join(',')
  const normalizedSelected = [...selected].sort((a, b) => a - b).join(',')
  return normalizedExpected === normalizedSelected
}

function toggleMultiAnswer(current: MultiAnswerMap, questionId: string, answer: number) {
  const selected = current[questionId] ?? []
  const nextSelected = selected.includes(answer)
    ? selected.filter((item) => item !== answer)
    : [...selected, answer]

  return {
    ...current,
    [questionId]: nextSelected,
  }
}

function pageTitle(view: View, activeModule: string) {
  if (view === 'dashboard') return 'Accueil'
  if (view === 'modules') return activeModule
  if (view === 'flashcards') return 'Flashcards'
  if (view === 'professor-exams') return 'Examens prof'
  return 'Examen blanc'
}

export default App
