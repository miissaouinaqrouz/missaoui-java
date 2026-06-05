export type CourseModule = {
  id: string
  title: string
  shortTitle: string
  source: string
  level: 'Fondations' | 'Core' | 'Data' | 'API'
  accent: string
  duration: string
  summary: string
  objectives: string[]
  keyPoints: string[]
  code?: string
  pitfalls: string[]
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
}

export type Flashcard = {
  id: string
  front: string
  back: string
}

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

export type MultiAnswerQuestion = {
  id: string
  question: string
  options: string[]
  answers: number[]
  explanation: string
}

export type ProfessorExam = {
  id: string
  title: string
  year: string
  duration: string
  source: string
  description: string
  openExercises: {
    title: string
    prompt: string
    expected: string[]
    code?: string
  }[]
  mcq: MultiAnswerQuestion[]
}

export type PresentationSection = {
  title: string
  items: string[]
}

export const modules: CourseModule[] = [
  {
    id: 'spring-intro',
    title: 'Présentation de Spring',
    shortTitle: 'Présentation',
    source: '00 - Présentation.pdf',
    level: 'Fondations',
    accent: '#0f766e',
    duration: '35 min',
    summary:
      "Spring réduit le couplage entre objets grâce à l'inversion de contrôle et l'injection de dépendances. Le code métier dépend d'interfaces, tandis que le conteneur assemble les implémentations.",
    objectives: [
      'Identifier les effets du couplage fort',
      "Expliquer le rôle d'un conteneur IoC",
      'Relier injection de dépendances, modularité et architecture n-tiers',
    ],
    keyPoints: [
      "Dépendre d'une classe concrète avec new rend le remplacement d'implémentation difficile.",
      "Une dépendance par interface laisse une entité externe fournir l'implémentation.",
      "Tout objet géré par Spring est un bean vivant dans un ApplicationContext.",
      "Spring fournit aussi JDBC, transactions, AOP, MVC, sécurité et intégrations comme Hibernate.",
    ],
    code: `public class Order {
  private IWriter writer;

  public Order(IWriter writer) {
    this.writer = writer;
  }

  public void write() {
    writer.write(getState());
  }
}`,
    pitfalls: [
      "Mettre des new partout dans le métier annule l'intérêt de l'IoC.",
      "Confondre Spring Framework avec Spring Boot: Boot simplifie le démarrage, Spring reste le socle.",
    ],
    flashcards: [
      {
        id: 'f-intro-1',
        front: "Que signifie IoC dans l'écosystème Spring ?",
        back: "Inversion of Control: le conteneur pilote la création et l'assemblage des objets au lieu du code métier.",
      },
      {
        id: 'f-intro-2',
        front: "Pourquoi dépendre d'une interface plutôt que d'une classe concrète ?",
        back: "Pour réduire le couplage, changer l'implémentation plus facilement et améliorer la testabilité.",
      },
      {
        id: 'f-intro-3',
        front: "Qu'est-ce qu'un bean Spring ?",
        back: "Un objet instancié, configuré et géré par le conteneur Spring.",
      },
    ],
    quiz: [
      {
        id: 'q-intro-1',
        question: "Quel problème l'injection de dépendances cherche-t-elle principalement à réduire ?",
        options: ['Le couplage fort', 'La taille du bytecode', 'Le nombre de classes Java', 'La compilation Maven'],
        answer: 0,
        explanation: "L'injection de dépendances sépare l'objet de la création de ses collaborateurs.",
      },
      {
        id: 'q-intro-2',
        question: "Dans Spring, où vivent les beans pendant l'exécution ?",
        options: ['Dans ApplicationContext', 'Dans web.xml uniquement', 'Dans le compilateur', 'Dans pom.xml'],
        answer: 0,
        explanation: "ApplicationContext représente le contexte applicatif qui contient les beans.",
      },
    ],
  },
  {
    id: 'xml-beans',
    title: 'Prise en main de Spring',
    shortTitle: 'Beans XML',
    source: '01 - Prise en main de Spring.pdf',
    level: 'Core',
    accent: '#2563eb',
    duration: '45 min',
    summary:
      "Les premiers assemblages Spring peuvent être déclarés en XML: définition de beans, injection par constructeur, injection par accesseur, valeurs scalaires et récupération depuis le contexte.",
    objectives: [
      'Déclarer un bean en XML',
      'Comparer injection par constructeur et par setter',
      'Créer un contexte applicatif et récupérer un bean',
    ],
    keyPoints: [
      "constructor-arg exprime une dépendance obligatoire et un contrat fort.",
      "property convient aux dépendances facultatives mais peut rendre l'objet incomplet.",
      "Spring convertit les valeurs scalaires XML vers les types primitifs quand c'est possible.",
      "L'ordre XML n'est pas le point central: Spring résout les références entre beans.",
    ],
    code: `<bean id="utilisateurService"
      class="ma.school.UtilisateurServiceImpl">
  <constructor-arg ref="utilisateurRepository"/>
  <property name="active" value="true"/>
</bean>

<bean id="utilisateurRepository"
      class="ma.school.DefaultRepository"/>`,
    pitfalls: [
      'Utiliser les setters pour des dépendances strictement obligatoires.',
      'Multiplier les beans XML sans convention de nommage claire.',
    ],
    flashcards: [
      {
        id: 'f-xml-1',
        front: 'Quand privilégier constructor-arg ?',
        back: "Quand la dépendance est obligatoire et que l'objet ne doit pas exister sans elle.",
      },
      {
        id: 'f-xml-2',
        front: 'Que fait property dans une définition XML ?',
        back: "Il appelle un setter JavaBean pour injecter une référence ou une valeur.",
      },
      {
        id: 'f-xml-3',
        front: 'Quel objet charge applicationContext.xml ?',
        back: 'ClassPathXmlApplicationContext ou une autre implémentation ApplicationContext.',
      },
    ],
    quiz: [
      {
        id: 'q-xml-1',
        question: 'Quelle balise injecte une dépendance via constructeur ?',
        options: ['constructor-arg', 'property', 'component-scan', 'tx:method'],
        answer: 0,
        explanation: 'constructor-arg correspond aux paramètres du constructeur.',
      },
      {
        id: 'q-xml-2',
        question: 'Quel avantage principal a l’injection par accesseur ?',
        options: ['Elle gère les dépendances facultatives', 'Elle interdit les null', 'Elle supprime XML', 'Elle crée une transaction'],
        answer: 0,
        explanation: 'Le setter permet de configurer des dépendances optionnelles après construction.',
      },
    ],
  },
  {
    id: 'lifecycle',
    title: 'Cycle de vie du conteneur Spring',
    shortTitle: 'Cycle de vie',
    source: '02 - Le cycle de vie du conteneur Spring.pdf',
    level: 'Core',
    accent: '#7c3aed',
    duration: '40 min',
    summary:
      "Le cycle de vie couvre le chargement des définitions, l'instanciation, l'injection, le post-traitement, l'exécution et la destruction contrôlée des beans.",
    objectives: [
      'Décrire les phases du contexte Spring',
      'Différencier BeanFactoryPostProcessor et BeanPostProcessor',
      'Utiliser @PostConstruct et @PreDestroy',
    ],
    keyPoints: [
      "BeanFactoryPostProcessor agit sur les définitions avant la création des instances.",
      "BeanPostProcessor agit sur les instances après création et injection.",
      '@PostConstruct lance une méthode après injection des dépendances.',
      '@PreDestroy libère les ressources avant la disparition du contexte.',
    ],
    code: `@Component
public class CacheLoader {
  @PostConstruct
  void start() {
    warmUp();
  }

  @PreDestroy
  void stop() {
    closeResources();
  }
}`,
    pitfalls: [
      'Oublier de fermer les ressources externes dans les beans de longue durée.',
      'Mettre une logique métier lourde dans un post-processeur global.',
    ],
    flashcards: [
      {
        id: 'f-life-1',
        front: 'Quand @PostConstruct est-elle appelée ?',
        back: "Après l'injection des dépendances, avant que le bean soit utilisé normalement.",
      },
      {
        id: 'f-life-2',
        front: 'Quel callback prépare la destruction ?',
        back: '@PreDestroy, destroy-method ou DisposableBean.',
      },
      {
        id: 'f-life-3',
        front: 'BeanPostProcessor travaille sur quoi ?',
        back: 'Sur les instances de beans déjà créées.',
      },
    ],
    quiz: [
      {
        id: 'q-life-1',
        question: 'Quel élément modifie une définition de bean avant instanciation ?',
        options: ['BeanFactoryPostProcessor', 'BeanPostProcessor', '@Repository', 'JdbcTemplate'],
        answer: 0,
        explanation: 'Il intervient avant la création concrète des beans.',
      },
      {
        id: 'q-life-2',
        question: 'Quelle annotation est portable JSR-250 pour initialiser un bean ?',
        options: ['@PostConstruct', '@Transactional', '@PathVariable', '@Query'],
        answer: 0,
        explanation: '@PostConstruct est un callback standard utilisé par Spring.',
      },
    ],
  },
  {
    id: 'advanced-beans',
    title: 'Configuration avancée des beans',
    shortTitle: 'Config avancée',
    source: '03 - Configuration avancée des beans.pdf',
    level: 'Core',
    accent: '#c2410c',
    duration: '50 min',
    summary:
      "La configuration avancée enrichit XML avec héritage de définition, beans internes, namespaces pratiques, injection de collections et Spring Expression Language.",
    objectives: [
      'Reconnaître un bean parent abstrait',
      'Injecter listes, sets, maps et propriétés',
      'Lire une expression SpEL simple',
    ],
    keyPoints: [
      "L'héritage Spring est un héritage de configuration, pas un héritage Java.",
      'Un inner bean est local à une propriété ou à un argument constructeur.',
      'Les collections permettent de fournir plusieurs collaborateurs à un bean.',
      'SpEL permet de calculer une valeur depuis une propriété, un autre bean ou une expression.',
    ],
    code: `<bean id="baseService" abstract="true">
  <property name="timeout" value="30"/>
</bean>

<bean id="orderService" class="ma.school.OrderService"
      parent="baseService">
  <property name="taxRate" value="#{config.taxRate}"/>
</bean>`,
    pitfalls: [
      "Confondre parent XML et extends en Java.",
      'Abuser de SpEL pour cacher de la logique métier dans la configuration.',
    ],
    flashcards: [
      {
        id: 'f-adv-1',
        front: "Un bean parent Spring doit-il forcément avoir une classe ?",
        back: 'Non. Il peut servir uniquement de gabarit de configuration.',
      },
      {
        id: 'f-adv-2',
        front: 'Pourquoi utiliser un inner bean ?',
        back: "Pour créer un objet dépendant non réutilisable à l'extérieur de son bean propriétaire.",
      },
      {
        id: 'f-adv-3',
        front: 'À quoi sert SpEL ?',
        back: 'À évaluer des expressions dans la configuration Spring.',
      },
    ],
    quiz: [
      {
        id: 'q-adv-1',
        question: "Que représente l'attribut parent dans une balise bean ?",
        options: ['Un héritage de configuration', 'Un héritage Java obligatoire', 'Une clé étrangère', 'Une transaction parente'],
        answer: 0,
        explanation: "Spring copie ou surcharge des propriétés de définition de bean.",
      },
      {
        id: 'q-adv-2',
        question: 'Quel élément est ignoré pour un bean interne ?',
        options: ['Son identifiant réutilisable', 'Son constructeur', 'Ses propriétés', 'Sa classe Java'],
        answer: 0,
        explanation: "Un inner bean n'est pas destiné à être référencé ailleurs.",
      },
    ],
  },
  {
    id: 'annotations-di',
    title: 'Injection de dépendance avec les annotations',
    shortTitle: 'Annotations',
    source: '04 - Injection de dépendance avec les annotations.pdf',
    level: 'Core',
    accent: '#0891b2',
    duration: '45 min',
    summary:
      "Les annotations réduisent la configuration XML: Spring détecte les composants, nomme les beans et résout les dépendances avec @Autowired, @Qualifier et les stéréotypes.",
    objectives: [
      'Identifier les stéréotypes Spring',
      'Utiliser @Autowired avec constructeur',
      'Résoudre une ambiguïté avec @Qualifier',
    ],
    keyPoints: [
      '@Component est le stéréotype générique.',
      '@Service marque la couche métier, @Repository la couche accès aux données et traduit les exceptions.',
      "L'injection constructeur reste le choix robuste pour les dépendances obligatoires.",
      '@Qualifier sélectionne un bean lorsque plusieurs candidats existent.',
    ],
    code: `@Service
public class ProduitService {
  private final ProduitRepository repository;

  public ProduitService(@Qualifier("jdbcProduitRepository")
                        ProduitRepository repository) {
    this.repository = repository;
  }
}`,
    pitfalls: [
      "Laisser deux implémentations sans @Qualifier ni @Primary.",
      "Utiliser l'injection par champ alors que le constructeur rend les dépendances explicites.",
    ],
    flashcards: [
      {
        id: 'f-ann-1',
        front: 'Quel stéréotype convient à une classe métier ?',
        back: '@Service.',
      },
      {
        id: 'f-ann-2',
        front: 'Pourquoi @Repository est spécial ?',
        back: "Il marque le DAO et participe à la traduction des exceptions d'accès aux données.",
      },
      {
        id: 'f-ann-3',
        front: 'Comment lever une ambiguïté entre deux beans du même type ?',
        back: 'Avec @Qualifier ou @Primary.',
      },
    ],
    quiz: [
      {
        id: 'q-ann-1',
        question: 'Quelle annotation indique une classe de service métier ?',
        options: ['@Service', '@Table', '@PathVariable', '@ControllerAdvice'],
        answer: 0,
        explanation: '@Service est un stéréotype spécialisé de @Component.',
      },
      {
        id: 'q-ann-2',
        question: 'Que fait @Qualifier ?',
        options: ['Choisit un bean précis', 'Ouvre une transaction', 'Crée une table', 'Retourne 404'],
        answer: 0,
        explanation: '@Qualifier désambiguïse les candidats lors de l’injection.',
      },
    ],
  },
  {
    id: 'aop',
    title: 'Programmation orientée aspect',
    shortTitle: 'AOP',
    source: '06 - Programmation Orientée Aspect (AOP).pdf',
    level: 'Core',
    accent: '#be123c',
    duration: '55 min',
    summary:
      "L'AOP extrait les préoccupations transversales comme logs, sécurité, transactions et mesure de performance dans des aspects appliqués par proxy autour du code métier.",
    objectives: [
      'Définir aspect, join point, pointcut et advice',
      'Choisir le bon type de advice',
      'Comprendre le rôle des proxies Spring',
    ],
    keyPoints: [
      'Un join point Spring est généralement un appel de méthode.',
      'Un pointcut sélectionne les méthodes ciblées par une expression.',
      '@Before, @AfterReturning, @AfterThrowing et @Around modulent le moment d’exécution.',
      '@Around est puissant mais doit appeler proceed() pour continuer la chaîne.',
    ],
    code: `@Aspect
@Component
public class AuditAspect {
  @Around("execution(* ma.school.service.*.*(..))")
  public Object trace(ProceedingJoinPoint pjp) throws Throwable {
    long start = System.currentTimeMillis();
    try {
      return pjp.proceed();
    } finally {
      log.info("{} ms", System.currentTimeMillis() - start);
    }
  }
}`,
    pitfalls: [
      'Oublier proceed() dans un @Around bloque la méthode métier.',
      'Appeler une méthode du même bean peut contourner le proxy Spring.',
    ],
    flashcards: [
      {
        id: 'f-aop-1',
        front: 'Qu’est-ce qu’un pointcut ?',
        back: 'Une expression qui sélectionne les join points visés par un aspect.',
      },
      {
        id: 'f-aop-2',
        front: 'Quel advice peut remplacer ou entourer complètement un appel ?',
        back: '@Around.',
      },
      {
        id: 'f-aop-3',
        front: 'Cite deux préoccupations transversales.',
        back: 'Logs, sécurité, transactions, cache ou métriques.',
      },
    ],
    quiz: [
      {
        id: 'q-aop-1',
        question: 'Dans Spring AOP, que cible le plus souvent un join point ?',
        options: ['Un appel de méthode', 'Une colonne SQL', 'Un fichier CSS', 'Une route réseau'],
        answer: 0,
        explanation: 'Spring AOP travaille principalement au niveau des méthodes via proxy.',
      },
      {
        id: 'q-aop-2',
        question: 'Quelle annotation déclare une classe comme aspect ?',
        options: ['@Aspect', '@Entity', '@Bean', '@Valid'],
        answer: 0,
        explanation: '@Aspect vient d’AspectJ et Spring peut l’utiliser pour créer des advices.',
      },
    ],
  },
  {
    id: 'jdbc',
    title: 'Accès aux données JDBC avec Spring',
    shortTitle: 'JDBC',
    source: '07 - Accès aux données JDBC avec Spring.pdf',
    level: 'Data',
    accent: '#16a34a',
    duration: '45 min',
    summary:
      "Spring simplifie JDBC avec DataSource, JdbcTemplate, RowMapper, initialisation de bases embarquées et une hiérarchie d'exceptions unifiée.",
    objectives: [
      'Comprendre le rôle de JdbcTemplate',
      'Mapper une ligne SQL vers un objet',
      "Reconnaître DataAccessException",
    ],
    keyPoints: [
      'JdbcTemplate gère connexion, statement, result set et fermeture des ressources.',
      'RowMapper transforme une ligne ResultSet en objet métier.',
      'DataAccessException est unchecked et indépendante du fournisseur JDBC.',
      'Le namespace jdbc peut créer et initialiser une base H2, HSQL ou Derby pour les tests.',
    ],
    code: `public List<Student> findAll() {
  return jdbcTemplate.query(
    "select id, nom, email from student",
    (rs, rowNum) -> new Student(
      rs.getLong("id"),
      rs.getString("nom"),
      rs.getString("email")
    )
  );
}`,
    pitfalls: [
      'Fermer manuellement une connexion déjà gérée par Spring.',
      'Laisser des requêtes concaténées avec des paramètres utilisateur.',
    ],
    flashcards: [
      {
        id: 'f-jdbc-1',
        front: 'Quel problème résout JdbcTemplate ?',
        back: 'Il supprime le code répétitif JDBC et sécurise la gestion des ressources.',
      },
      {
        id: 'f-jdbc-2',
        front: 'À quoi sert RowMapper ?',
        back: 'À convertir chaque ligne SQL en objet Java.',
      },
      {
        id: 'f-jdbc-3',
        front: 'Quelle hiérarchie Spring uniformise les erreurs de données ?',
        back: 'DataAccessException.',
      },
    ],
    quiz: [
      {
        id: 'q-jdbc-1',
        question: 'Quel composant exécute les requêtes JDBC avec moins de boilerplate ?',
        options: ['JdbcTemplate', 'EntityGraph', 'DispatcherServlet', 'BeanPostProcessor'],
        answer: 0,
        explanation: 'JdbcTemplate encapsule les opérations JDBC répétitives.',
      },
      {
        id: 'q-jdbc-2',
        question: 'DataAccessException est généralement...',
        options: ['Unchecked', 'Un contrôleur REST', 'Une annotation JPA', 'Un type de transaction'],
        answer: 0,
        explanation: 'Spring convertit les erreurs d’accès aux données en RuntimeException.',
      },
    ],
  },
  {
    id: 'transactions',
    title: 'Gestion des transactions avec Spring',
    shortTitle: 'Transactions',
    source: '08 - Gestion des transactions avec Spring.pdf',
    level: 'Data',
    accent: '#ca8a04',
    duration: '60 min',
    summary:
      "Spring délègue les transactions à un transaction manager et offre une configuration déclarative par XML ou annotations, avec propagation, isolation, timeout et règles de rollback.",
    objectives: [
      'Nommer les propriétés ACID',
      'Choisir un PlatformTransactionManager',
      'Configurer @Transactional',
    ],
    keyPoints: [
      'ACID signifie atomicité, cohérence, isolation et durabilité.',
      'DataSourceTransactionManager convient à JDBC local.',
      'JpaTransactionManager convient à JPA.',
      '@Transactional rollback par défaut sur RuntimeException.',
      'REQUIRED réutilise une transaction existante ou en crée une nouvelle.',
    ],
    code: `@Service
public class CommandeService {
  @Transactional
  public void passerCommande(Commande commande) {
    commandeRepository.save(commande);
    stockService.decrementer(commande);
  }

  @Transactional(readOnly = true)
  public List<Commande> lister() {
    return commandeRepository.findAll();
  }
}`,
    pitfalls: [
      "Mettre @Transactional sur une méthode privée et attendre qu'un proxy l'intercepte.",
      'Ignorer la propagation lors de l’appel entre services.',
    ],
    flashcards: [
      {
        id: 'f-tx-1',
        front: 'Que veut dire ACID ?',
        back: 'Atomicité, cohérence, isolation, durabilité.',
      },
      {
        id: 'f-tx-2',
        front: 'Quelle propagation est la valeur par défaut ?',
        back: 'REQUIRED.',
      },
      {
        id: 'f-tx-3',
        front: 'Quelle exception déclenche un rollback par défaut ?',
        back: 'Une RuntimeException ou Error.',
      },
    ],
    quiz: [
      {
        id: 'q-tx-1',
        question: 'Quel transaction manager est adapté à JPA ?',
        options: ['JpaTransactionManager', 'BeanFactoryPostProcessor', 'RowMapper', 'JtaTemplate'],
        answer: 0,
        explanation: 'JpaTransactionManager coordonne EntityManager et transactions JPA locales.',
      },
      {
        id: 'q-tx-2',
        question: 'Que fait Propagation.REQUIRED ?',
        options: ['Réutilise ou crée une transaction', 'Force toujours une nouvelle transaction', 'Interdit toute transaction', 'Désactive le rollback'],
        answer: 0,
        explanation: 'REQUIRED rejoint la transaction active, sinon en démarre une.',
      },
    ],
  },
  {
    id: 'jpa-hibernate',
    title: 'JPA, Hibernate et Spring Data JPA',
    shortTitle: 'JPA',
    source: 'Formation_JPA_Hibernate_SpringJPA.pptx',
    level: 'Data',
    accent: '#4f46e5',
    duration: '70 min',
    summary:
      "JPA définit le mapping objet-relationnel, Hibernate l'implémente, et Spring Data JPA génère les repositories pour réduire le code d'accès aux données.",
    objectives: [
      'Mapper une entité avec @Entity et @Id',
      'Distinguer LAZY et EAGER',
      'Éviter le problème N+1',
      'Créer un JpaRepository et des query methods',
    ],
    keyPoints: [
      '@Entity marque une classe persistante et @Id sa clé primaire.',
      '@OneToMany et @ManyToOne modélisent les relations; mappedBy désigne le côté inverse.',
      'LAZY est conseillé par défaut pour éviter des chargements inutiles.',
      'JOIN FETCH ou @EntityGraph peuvent réduire le N+1.',
      'JpaRepository fournit CRUD, pagination et tri sans implémentation manuelle.',
    ],
    code: `@Entity
public class Auteur {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100)
  private String nom;

  @OneToMany(mappedBy = "auteur", fetch = FetchType.LAZY)
  private List<Livre> livres = new ArrayList<>();
}

public interface AuteurRepository
    extends JpaRepository<Auteur, Long> {
  @EntityGraph(attributePaths = "livres")
  List<Auteur> findAll();
}`,
    pitfalls: [
      'Mettre EAGER partout et découvrir des requêtes massives.',
      'Oublier d’initialiser les collections dans une entité.',
      'Confondre JPQL, qui parle en entités, avec SQL, qui parle en tables.',
    ],
    flashcards: [
      {
        id: 'f-jpa-1',
        front: 'Quelle annotation marque une classe persistante ?',
        back: '@Entity.',
      },
      {
        id: 'f-jpa-2',
        front: 'Qui implémente JPA le plus souvent ?',
        back: 'Hibernate.',
      },
      {
        id: 'f-jpa-3',
        front: 'Comment résoudre un N+1 fréquent ?',
        back: 'Avec JOIN FETCH, @EntityGraph ou une requête adaptée.',
      },
    ],
    quiz: [
      {
        id: 'q-jpa-1',
        question: 'Dans une relation bidirectionnelle, que signifie mappedBy ?',
        options: ['Le côté inverse de la relation', 'La clé primaire', 'Une méthode HTTP', 'Un niveau d’isolation'],
        answer: 0,
        explanation: 'mappedBy indique que la relation est possédée par le champ nommé côté opposé.',
      },
      {
        id: 'q-jpa-2',
        question: 'Quel repository donne CRUD, pagination et tri ?',
        options: ['JpaRepository', 'JdbcDriver', 'ApplicationContext', 'Aspect'],
        answer: 0,
        explanation: 'JpaRepository étend les contrats Spring Data pour les entités JPA.',
      },
    ],
  },
  {
    id: 'rest-api',
    title: 'REST API avec Spring Boot',
    shortTitle: 'REST API',
    source: 'REST_API_SpringBoot.pdf',
    level: 'API',
    accent: '#dc2626',
    duration: '55 min',
    summary:
      "Une API REST expose des ressources via HTTP, JSON et des URLs stables. Spring Boot accélère le développement avec auto-configuration, contrôleurs REST, validation DTO et gestion globale des erreurs.",
    objectives: [
      'Associer méthodes HTTP et CRUD',
      'Écrire un contrôleur REST Spring Boot',
      'Retourner des ResponseEntity cohérents',
      'Valider les DTO et centraliser les erreurs',
    ],
    keyPoints: [
      'GET lit, POST crée, PUT remplace, PATCH modifie partiellement, DELETE supprime.',
      'Les URLs REST utilisent des noms pluriels sans verbe: /api/v1/students.',
      '@RestController sérialise les réponses en JSON.',
      'ResponseEntity contrôle précisément les statuts comme 200, 201, 404 et 204.',
      '@RestControllerAdvice centralise la transformation des exceptions en réponses JSON.',
    ],
    code: `@RestController
@RequestMapping("/api/v1/students")
public class StudentController {
  private final StudentService service;

  @PostMapping
  public ResponseEntity<Student> create(@Valid @RequestBody StudentDTO dto) {
    Student saved = service.create(dto);
    URI location = URI.create("/api/v1/students/" + saved.getId());
    return ResponseEntity.created(location).body(saved);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Student> getById(@PathVariable Long id) {
    return service.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }
}`,
    pitfalls: [
      'Retourner 200 OK pour une ressource introuvable.',
      'Nommer les routes avec des verbes comme /createUser.',
      'Accepter un body non validé côté serveur.',
    ],
    flashcards: [
      {
        id: 'f-rest-1',
        front: 'Quel statut HTTP pour une création réussie ?',
        back: '201 Created, idéalement avec un header Location.',
      },
      {
        id: 'f-rest-2',
        front: 'Quelle annotation lit /students/{id} ?',
        back: '@PathVariable.',
      },
      {
        id: 'f-rest-3',
        front: 'Quelle annotation active la validation d’un DTO ?',
        back: '@Valid, avec des contraintes comme @NotNull, @Email ou @Size.',
      },
    ],
    quiz: [
      {
        id: 'q-rest-1',
        question: 'Quelle méthode HTTP est idempotente et supprime une ressource ?',
        options: ['DELETE', 'POST', 'PATCH toujours', 'CONNECT'],
        answer: 0,
        explanation: 'DELETE est conçu pour supprimer une ressource et reste idempotent.',
      },
      {
        id: 'q-rest-2',
        question: 'Quelle annotation combine @Controller et @ResponseBody ?',
        options: ['@RestController', '@Entity', '@Transactional', '@Autowired'],
        answer: 0,
        explanation: '@RestController renvoie directement les objets sérialisés.',
      },
    ],
  },
]

export const allFlashcards = modules.flatMap((module) =>
  module.flashcards.map((card) => ({
    ...card,
    moduleId: module.id,
    moduleTitle: module.shortTitle,
    accent: module.accent,
  })),
)

export const examQuestions: QuizQuestion[] = modules.flatMap((module) =>
  module.quiz.map((question) => ({
    ...question,
    id: `exam-${question.id}`,
  })),
)

export const presentationSheets: Record<string, PresentationSection[]> = {
  'spring-intro': [
    {
      title: 'Problème des dépendances',
      items: [
        'Une dépendance forte empêche de réutiliser A sans réutiliser B.',
        'Un changement de signature dans B peut forcer la modification et la recompilation de A.',
        'Les effets classiques sont rigidité, fragilité et immobilité de l’application.',
      ],
    },
    {
      title: 'Apports de Spring',
      items: [
        'Spring fournit une configuration centralisée et déclarative des dépendances.',
        'Le framework est non intrusif: les classes métier peuvent rester de simples POJO.',
        'Spring gère l’instanciation, l’injection, l’utilisation et la destruction des beans.',
      ],
    },
    {
      title: 'Socle technique',
      items: [
        'Spring fournit la plomberie technique pour laisser les développeurs se concentrer sur le métier.',
        'Les outils Spring couvrent JDBC, transactions déclaratives, AOP, MVC et intégration Hibernate.',
        'Le principe Hollywood résume l’IoC: le conteneur appelle le code au bon moment.',
      ],
    },
  ],
  'xml-beans': [
    {
      title: 'Déclaration XML',
      items: [
        'Un bean XML possède généralement un id et une classe Java à instancier.',
        'constructor-arg injecte les paramètres du constructeur; property appelle un setter JavaBean.',
        'Spring peut injecter des références vers d’autres beans ou des valeurs scalaires converties automatiquement.',
      ],
    },
    {
      title: 'Choix du type d’injection',
      items: [
        'Constructeur: dépendances obligatoires, contrat fort, déclaration concise.',
        'Setter: dépendances facultatives, configuration lisible, mais risque d’objet incomplet.',
        'Les deux styles peuvent être mélangés, mais il faut rester cohérent dans le projet.',
      ],
    },
    {
      title: 'Factories et contexte',
      items: [
        'factory-method permet d’instancier un bean via une méthode statique ou via un bean fabrique.',
        'ClassPathXmlApplicationContext charge le fichier XML depuis le classpath.',
        'getBean récupère une instance gérée par Spring depuis le contexte applicatif.',
      ],
    },
  ],
  lifecycle: [
    {
      title: 'Phases du contexte',
      items: [
        'Initialisation: chargement des définitions, création des instances et injection.',
        'Exécution: les beans initialisés sont utilisés par l’application.',
        'Destruction: le contexte est stoppé et les callbacks de libération sont appelés.',
      ],
    },
    {
      title: 'Post-processeurs',
      items: [
        'BeanFactoryPostProcessor intervient sur les définitions avant instanciation.',
        'BeanPostProcessor intervient sur les instances après leur création.',
        'RequiredAnnotationBeanPostProcessor vérifie par exemple que les propriétés @Required sont renseignées.',
      ],
    },
    {
      title: 'Configuration externe',
      items: [
        'PropertyPlaceholderConfigurer remplace des placeholders comme ${datasource.url}.',
        'Les propriétés permettent de sortir URL, user et paramètres de connexion du XML principal.',
        '@PostConstruct et @PreDestroy sont des callbacks JSR-250 portables.',
      ],
    },
  ],
  'advanced-beans': [
    {
      title: 'Héritage et beans internes',
      items: [
        'Un bean parent abstract sert de gabarit de configuration.',
        'Un bean enfant utilise parent pour reprendre et surcharger cette configuration.',
        'Un bean interne est local à une property ou constructor-arg et n’est pas réutilisable ailleurs.',
      ],
    },
    {
      title: 'Namespaces utiles',
      items: [
        'p-namespace simplifie l’écriture des propriétés: p:email="bob@aol.com".',
        'c-namespace simplifie l’injection constructeur et accepte les index pour lever les ambiguïtés.',
        'util permet de déclarer simplement properties, list, set et map.',
      ],
    },
    {
      title: 'Collections et SpEL',
      items: [
        'Spring sait injecter list, set, map et props dans les beans.',
        'SpEL utilise #{...} pour évaluer des expressions, appeler des propriétés ou calculer une valeur.',
        'Il faut garder SpEL pour la configuration, pas pour cacher de la logique métier.',
      ],
    },
  ],
  'annotations-di': [
    {
      title: 'XML vs annotations',
      items: [
        'Les annotations placent la configuration dans le code source et réduisent le XML.',
        'component-scan détecte les classes annotées dans un package racine et ses sous-packages.',
        'Un package trop large ralentit le démarrage; un package trop précis peut ignorer des classes.',
      ],
    },
    {
      title: 'JSR-330',
      items: [
        '@Inject est le standard JSR-330 et couvre une grande partie des besoins.',
        '@Named peut nommer un bean ou choisir un candidat lors de l’injection.',
        'Spring reste plus riche avec @Autowired, @Qualifier, @Value, @Lazy et @Required.',
      ],
    },
    {
      title: 'Stéréotypes',
      items: [
        '@Component déclare un composant générique.',
        '@Service caractérise la couche métier; @Repository caractérise l’accès aux données.',
        'On peut créer ses propres stéréotypes avec des méta-annotations, par exemple @Service + @Transactional.',
      ],
    },
  ],
  aop: [
    {
      title: 'Pourquoi AOP',
      items: [
        'L’AOP sépare les préoccupations techniques des descriptions métier.',
        'Elle réduit le code tangling: logique métier mélangée avec sécurité, logs ou transactions.',
        'Elle réduit le code scattering: même logique technique copiée dans plusieurs classes.',
      ],
    },
    {
      title: 'Vocabulaire',
      items: [
        'Aspect: classe qui regroupe pointcuts et advices.',
        'Join point: point d’exécution, souvent un appel de méthode avec Spring AOP.',
        'Pointcut: expression qui sélectionne des join points; advice: code greffé sur ces points.',
      ],
    },
    {
      title: 'Spring AOP vs AspectJ',
      items: [
        'Spring AOP agit sur les beans Spring et les méthodes publiques via proxies.',
        'AspectJ est plus complet et peut tisser le bytecode, y compris sur des points privés.',
        'Un appel interne à une méthode du même bean peut contourner le proxy Spring.',
      ],
    },
  ],
  jdbc: [
    {
      title: 'Problèmes du JDBC brut',
      items: [
        'Le code doit établir la connexion, gérer transaction, commit, rollback et fermeture.',
        'La gestion répétitive des ressources pollue le code métier et provoque facilement des erreurs.',
        'Les exceptions checked comme SQLException couplent les couches supérieures aux détails techniques.',
      ],
    },
    {
      title: 'Solutions Spring',
      items: [
        'JdbcTemplate applique le pattern Template Method pour masquer les détails techniques.',
        'DataAccessException est une hiérarchie unchecked qui abstrait SQLException, HibernateException, etc.',
        'JdbcTemplate est thread-safe et réutilisable.',
      ],
    },
    {
      title: 'Namespace JDBC',
      items: [
        '<jdbc:embedded-database> crée une DataSource embarquée pour les tests.',
        'Spring supporte HSQL, H2 et Derby pour les bases embarquées.',
        '<jdbc:initialize-database> exécute des scripts SQL de schéma ou de données.',
      ],
    },
  ],
  transactions: [
    {
      title: 'Transaction managers',
      items: [
        'Spring ne réécrit pas un moteur transactionnel: il délègue à un transaction manager.',
        'DataSourceTransactionManager convient à JDBC local.',
        'JpaTransactionManager et HibernateTransactionManager sont adaptés aux couches ORM.',
      ],
    },
    {
      title: '@Transactional',
      items: [
        'La transaction démarre avant la méthode, commit si tout se passe bien, rollback sur RuntimeException.',
        'readOnly=true indique une transaction de lecture et peut permettre des optimisations.',
        'timeout déclenche un rollback si l’exécution dépasse la durée autorisée.',
      ],
    },
    {
      title: 'Isolation et propagation',
      items: [
        'Isolation contrôle la visibilité entre transactions concurrentes.',
        'Propagation.REQUIRED rejoint une transaction existante ou en crée une nouvelle.',
        'REQUIRES_NEW suspend l’éventuelle transaction courante et en démarre une autre.',
      ],
    },
  ],
  'jpa-hibernate': [
    {
      title: 'Problème objet-relationnel',
      items: [
        'Le monde objet manipule héritage, associations, références mémoire et collections.',
        'Le monde relationnel manipule tables, clés primaires, clés étrangères et jointures.',
        'L’ORM sert de traducteur entre ces deux modèles.',
      ],
    },
    {
      title: 'Pile JPA',
      items: [
        'JPA est une spécification: elle définit les annotations et contrats.',
        'Hibernate est une implémentation JPA courante.',
        'Spring Data JPA ajoute les repositories, query methods, pagination et tri avec peu de code.',
      ],
    },
    {
      title: 'Performance',
      items: [
        'LAZY charge à la demande et reste conseillé par défaut.',
        'EAGER charge immédiatement et peut provoquer des requêtes trop lourdes.',
        'Le problème N+1 se corrige avec JOIN FETCH ou @EntityGraph.',
      ],
    },
  ],
  'rest-api': [
    {
      title: 'HTTP et REST',
      items: [
        'Une requête HTTP contient une ligne de requête, des headers et parfois un body.',
        'Une réponse HTTP contient un statut, des headers et parfois un body JSON.',
        'REST expose des ressources via des URLs standardisées et des représentations JSON ou XML.',
      ],
    },
    {
      title: 'Contraintes REST',
      items: [
        'Client-serveur: séparation entre interface et données.',
        'Stateless: chaque requête porte les informations nécessaires.',
        'Interface uniforme: URLs, verbes HTTP et formats cohérents.',
      ],
    },
    {
      title: 'Spring Boot REST',
      items: [
        '@RestController combine contrôleur et sérialisation JSON automatique.',
        '@PathVariable lit une valeur dans l’URL; @RequestParam lit un paramètre de requête.',
        '@Valid active la validation DTO; @RestControllerAdvice centralise les erreurs.',
      ],
    },
  ],
}

export const professorExams: ProfessorExam[] = [
  {
    id: 'exam-2024-2025',
    title: 'Examen Développement Avancé JEE',
    year: '2024-2025',
    duration: '1h20',
    source: 'Examen_Prog_Avancee_HADDOUTI_2024-2025.pdf',
    description:
      'Sujet du professeur avec questions rédactionnelles, QCM à choix multiples, scénario REST et correction de conception Spring.',
    openExercises: [
      {
        title: 'Partie A - Questions directes',
        prompt:
          'Lister les bonnes pratiques RESTful, expliquer JDBC vs Spring JDBC, puis citer quatre annotations Spring avec leur utilité.',
        expected: [
          'REST: URLs en ressources au pluriel, verbes HTTP sémantiques, statuts précis, versioning, pagination/filtrage, validation et sécurité.',
          'JDBC est l’API bas niveau; Spring JDBC ajoute JdbcTemplate, gestion des ressources et traduction des exceptions.',
          'Annotations possibles: @Component, @Service, @Repository, @Autowired, @Configuration, @RestController, @RequestMapping, @Transactional.',
        ],
      },
      {
        title: 'Partie C - Modification REST réussie',
        prompt:
          'Compléter le tableau pour la modification réussie d’un examen qui possède un identifiant et une propriété note.',
        expected: [
          'URL: /api/v1/examens/12',
          'Méthode: PUT pour remplacer la ressource, ou PATCH si seule la note est modifiée partiellement.',
          'Body requête: { "note": 16 }',
          'Code retour: 200 OK avec l’examen modifié, ou 204 No Content si aucune réponse n’est renvoyée.',
          'Body réponse conseillé: { "id": 12, "note": 16 }',
        ],
      },
      {
        title: 'Partie D - Conception et annotations Spring',
        prompt:
          'Identifier le problème dans ExamenService, proposer une modélisation UML, puis corriger le code avec les annotations Spring nécessaires.',
        code: `public class ExamenService {
  private ExamenDaoImpl examenDao;

  List<Examen> recupererExamens() {
    return examenDao.recupererExamens();
  }
}

class ExamenDaoImpl implements ExamenDao {
  public List<Examen> recupererExamens() {
    return null;
  }
}

interface ExamenDao {
  List<Examen> recupererExamens();
}`,
        expected: [
          'Problème: le service dépend d’une classe concrète ExamenDaoImpl au lieu de dépendre de l’interface ExamenDao.',
          'Solution UML: ExamenService --> ExamenDao, et ExamenDaoImpl réalise ExamenDao.',
          'Correction: annoter ExamenService avec @Service, ExamenDaoImpl avec @Repository, injecter ExamenDao par constructeur.',
          'Code attendu: private final ExamenDao examenDao; public ExamenService(ExamenDao examenDao) { this.examenDao = examenDao; }',
        ],
      },
    ],
    mcq: [
      {
        id: 'p25-q1',
        question: 'Les informations nécessaires pour configurer une source de données Spring sont :',
        options: [
          'Le port de la base de données',
          'La version de la base de données',
          'Le nom de la base de données',
          'L’instance de JdbcTemplate',
        ],
        answers: [0, 2],
        explanation:
          'Une DataSource a besoin des informations de connexion comme URL, hôte/port, base, utilisateur et mot de passe. JdbcTemplate est créé après.',
      },
      {
        id: 'p25-q2',
        question: 'Un bean Spring peut être annoté avec :',
        options: ['@SpringBean', '@Contexte', '@Component', '@Configuration'],
        answers: [2, 3],
        explanation: '@Component déclare un bean détectable, et @Configuration est aussi un composant Spring spécialisé.',
      },
      {
        id: 'p25-q3',
        question: 'Un contexte Spring peut être créé à partir de :',
        options: [
          'Un fichier Maven pom.xml',
          'Une classe Java annotée avec @Configuration',
          'Une classe héritant de JdbcTemplate',
          'Une classe héritant de RowMapper',
        ],
        answers: [1],
        explanation: 'AnnotationConfigApplicationContext peut charger une classe @Configuration.',
      },
      {
        id: 'p25-q4',
        question: 'Les verbes HTTP pouvant utiliser un PathVariable /{id} dans un CRUD REST sont :',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        answers: [0, 2, 3],
        explanation: 'GET /ressources/{id}, PUT /ressources/{id} et DELETE /ressources/{id} ciblent une ressource existante.',
      },
      {
        id: 'p25-q5',
        question: 'La création d’un JdbcTemplate se base sur :',
        options: [
          'Une classe qui implémente RowMapper',
          'Un bean de type DataSource',
          'N’importe quelle classe',
          'JdbcTemplate n’est pas instanciable',
        ],
        answers: [1],
        explanation: 'JdbcTemplate reçoit une DataSource pour obtenir les connexions.',
      },
      {
        id: 'p25-q6',
        question: 'Le code de statut HTTP renvoyé en cas de rejet d’authentification est :',
        options: ['400', '401', '403', '406'],
        answers: [1],
        explanation: '401 signifie non authentifié. 403 signifie authentifié mais non autorisé.',
      },
      {
        id: 'p25-q7',
        question: 'Une entité Hibernate peut être annotée par :',
        options: ['@Entity', '@HibernateEntity', '@Component', '@ComponentEntity'],
        answers: [0],
        explanation: '@Entity vient de JPA et indique une classe persistante gérée par Hibernate.',
      },
      {
        id: 'p25-q8',
        question: 'La spécification JPA est responsable de :',
        options: [
          'La création d’un contexte d’application Spring',
          'La gestion de la persistance des données dans les applications Java',
          'JPA est suffisante pour faire fonctionner un projet',
          'JPA est insuffisante pour faire fonctionner un projet',
        ],
        answers: [1, 3],
        explanation: 'JPA définit la persistance, mais une implémentation comme Hibernate est nécessaire à l’exécution.',
      },
      {
        id: 'p25-q9',
        question: 'Si un seul bean Spring n’est pas configuré correctement, alors que tous les autres le sont :',
        options: [
          'Erreur lors de la compilation',
          'Erreur lors de l’exécution ou du démarrage du contexte',
          'L’application compilera sans erreur',
          'L’application se lancera sans erreur',
        ],
        answers: [1, 2],
        explanation: 'Une mauvaise configuration Spring apparaît généralement au démarrage ou à l’exécution, pas à la compilation Java.',
      },
    ],
  },
  {
    id: 'exam-2023-2024',
    title: 'Examen Development Avancé JEE',
    year: '2023-2024',
    duration: '1h',
    source: 'Examen_Prog_Avancée_GI4_2023-2024.pdf',
    description:
      'Sujet QCM du professeur couvrant Spring XML, cycle de vie, annotations, Spring JDBC, REST, architecture n-tiers et Hibernate.',
    openExercises: [
      {
        title: 'Méthode de préparation',
        prompt:
          'Traiter le QCM en mode examen: plusieurs choix peuvent être corrects et une réponse incomplète est considérée fausse.',
        expected: [
          'Lire chaque option séparément.',
          'Pour les questions REST, vérifier URL, verbe HTTP, body et code de statut.',
          'Pour Spring, distinguer annotation de déclaration de bean, annotation d’injection et annotation JPA.',
        ],
      },
    ],
    mcq: [
      {
        id: 'p24-q1',
        question: 'Pour créer le bean XML avec constructor-arg domainManager et property directoryRepository, il faut :',
        options: [
          'Un constructeur sans paramètre',
          'Un constructeur avec un seul paramètre',
          'Un setter de la propriété directoryRepository',
          'Un setter de la propriété directory',
        ],
        answers: [1, 2],
        explanation: 'constructor-arg impose un constructeur compatible; property name="directoryRepository" impose setDirectoryRepository.',
      },
      {
        id: 'p24-q2',
        question: 'Les implémentations de ApplicationContext fournies par Spring sont :',
        options: [
          'AnnotationConfigApplicationContext',
          'AppSpringApplicationContext',
          'SpringXmlAnnotationApplicationContext',
          'ClassPathXmlApplicationContext',
        ],
        answers: [0, 3],
        explanation: 'Ces deux classes sont des contextes Spring classiques pour configuration Java ou XML classpath.',
      },
      {
        id: 'p24-q3',
        question: 'La méthode callback après injection d’un bean doit être annotée par :',
        options: ['@PreDestroy', '@PostConstruct', '@InitMethod', '@AfterSet'],
        answers: [1],
        explanation: '@PostConstruct s’exécute après injection; @PreDestroy concerne la destruction.',
      },
      {
        id: 'p24-q4',
        question: 'L’externalisation de paramètres de configuration :',
        options: [
          'Se base sur PropertyPlaceholderConfigurer',
          'Se base sur PropertiesLoader',
          'Récupère une valeur avec ${nomCle}',
          'Récupère une valeur avec #{nomCle}',
        ],
        answers: [0, 2],
        explanation: 'Les placeholders utilisent ${...}; #{...} correspond à SpEL.',
      },
      {
        id: 'p24-q5',
        question: '@XXX sur public class EtudiantManager peut être remplacé par :',
        options: ['@Autowired', '@Component', '@Inject', '@Service'],
        answers: [1, 3],
        explanation: '@Component et @Service déclarent un bean. @Autowired et @Inject servent à l’injection.',
      },
      {
        id: 'p24-q6',
        question: 'Dans @Repository class C { @XXX I i; }, l’annotation d’injection est :',
        options: ['@Autowired', '@Bean', '@Component', '@Primary'],
        answers: [0],
        explanation: '@Autowired injecte une dépendance dans le champ.',
      },
      {
        id: 'p24-q7',
        question: 'Pour corriger une erreur “expected single matching bean but found 2” :',
        options: [
          'Annoter MyInterface par @Primary',
          'Annoter MySecondBean par @Qualifier',
          'Annoter MySecondBean par @Autowired',
          'Supprimer l’annotation qui déclare myFirstBean comme bean Spring',
        ],
        answers: [3],
        explanation:
          'Parmi ces choix, supprimer un candidat résout l’ambiguïté. En pratique, on préfère @Qualifier au point d’injection ou @Primary sur une implémentation.',
      },
      {
        id: 'p24-q8',
        question: 'La solution Spring JDBC :',
        options: [
          'Utilise le design pattern Template',
          'Démarre automatiquement une nouvelle transaction',
          'Génère SQL à partir de HQL',
          'Est une implémentation JPA',
        ],
        answers: [0],
        explanation: 'JdbcTemplate applique le pattern Template Method et simplifie le code JDBC.',
      },
      {
        id: 'p24-q9',
        question: 'Pour initialiser JdbcTemplate, il faut passer :',
        options: [
          'Les paramètres de connexion séparément',
          'Le fichier properties',
          'La DataSource',
          'Aucun paramètre',
        ],
        answers: [2],
        explanation: 'JdbcTemplate est construit autour d’une DataSource.',
      },
      {
        id: 'p24-q10',
        question: 'L’interface RowMapper :',
        options: [
          'Exécute une requête SQL',
          'Passe des paramètres à une requête SQL',
          'Transforme les résultats SQL en objets Java',
          'Transforme des objets Java en requête SQL',
        ],
        answers: [2],
        explanation: 'RowMapper mappe une ligne ResultSet vers un objet.',
      },
      {
        id: 'p24-q11',
        question: 'Le Webservice RESTful pour modifier une liste est :',
        options: ['PUT /liste/update', 'PUT /update-liste', 'PUT /liste', 'PUT /liste/{id}'],
        answers: [3],
        explanation: 'La modification d’une ressource existante cible son identifiant.',
      },
      {
        id: 'p24-q12',
        question: '@RequestParam est utilisé pour :',
        options: [
          'L’identifiant d’une ressource',
          'Les paramètres qui affinent une recherche',
          'Une valeur sous /nomRessource/{param}',
          'Une valeur sous /nomRessource?param=valeur',
        ],
        answers: [1, 3],
        explanation: '@RequestParam lit les paramètres de requête, contrairement à @PathVariable.',
      },
      {
        id: 'p24-q13',
        question: 'URL de @RequestMapping("/y") + @GetMapping("/x/{id}") :',
        options: ['GET /y/5', 'GET /x/5', 'GET /y/x/5', 'GET /x/y/5'],
        answers: [2],
        explanation: 'Le mapping classe et le mapping méthode se concatènent.',
      },
      {
        id: 'p24-q14',
        question: 'Le body d’une requête est renseigné pour :',
        options: ['POST', 'GET', 'DELETE', 'PUT'],
        answers: [0, 3],
        explanation: 'POST et PUT transportent généralement une représentation JSON dans le body.',
      },
      {
        id: 'p24-q15',
        question: 'Création de livre rejetée car le prix manque : code HTTP ?',
        options: ['200', '204', '400', '500'],
        answers: [2],
        explanation: 'Une donnée obligatoire manquante correspond à une mauvaise requête: 400 Bad Request.',
      },
      {
        id: 'p24-q16',
        question: 'Dans POST /livre, le Header sert à :',
        options: [
          'Envoyer le JSON du livre',
          'Envoyer les métadonnées comme Content-Type',
          'Envoyer le verbe HTTP',
          'Il n’est pas envoyé en POST',
        ],
        answers: [1],
        explanation: 'Le JSON est dans le body; les headers portent les métadonnées.',
      },
      {
        id: 'p24-q17',
        question: 'Dans une architecture 3 tiers, la logique métier est dans :',
        options: ['Le contrôleur', 'Le service', 'Le DAO', 'Le modèle'],
        answers: [1],
        explanation: 'La couche service porte les règles métier.',
      },
      {
        id: 'p24-q18',
        question: 'Le framework Selma permet de :',
        options: [
          'Ajouter getters/setters automatiquement',
          'Mapper une table avec une classe',
          'Générer les méthodes d’accès base de données',
          'Aucune de ces réponses',
        ],
        answers: [3],
        explanation: 'Selma est plutôt un mapper entre objets Java; aucune proposition ne décrit correctement ce rôle.',
      },
      {
        id: 'p24-q19',
        question: 'Dans une entité Hibernate, @Column permet de :',
        options: [
          'Supprimer une colonne',
          'Mapper une classe avec une colonne',
          'Mapper une propriété avec une colonne',
          'Aucune réponse',
        ],
        answers: [2],
        explanation: '@Column personnalise le mapping d’un attribut vers une colonne.',
      },
      {
        id: 'p24-q20',
        question: 'Book est mappée avec la table Livre. La requête HQL pour récupérer les livres est :',
        options: ['FROM book', 'FROM livre', 'SELECT livre FROM book', 'SELECT book FROM livre'],
        answers: [0],
        explanation: 'HQL raisonne sur l’entité Java, pas sur le nom de table. La forme attendue serait FROM Book.',
      },
    ],
  },
]
