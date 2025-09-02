import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  ar: {
    translation: {
      // Header
      "header.home": "الرئيسية",
      "header.features": "المميزات",
      "header.benefits": "الفوائد",
      "header.howItWorks": "كيف يعمل",
      "header.pricing": "التسعير",
      "header.contact": "تواصل معنا",
      "header.admin": "لوحة التحكم",
      "header.getStarted": "قات ستارتد",
      "header.title": "TaalimFlow",
      "header.subtitle": "إدارة ذكية للمدارس",


      // Hero Section
      "hero.title": "حوّل مدرستك",
      "hero.subtitle": "مع TaalimFlow",
      "hero.description":
        "منصة رقمية شاملة مصممة خصيصاً للمدارس الجزائرية. إدارة الطلاب، تتبع الحضور، تسهيل التواصل، ومعالجة المدفوعات في مكان واحد.",
      "hero.schoolsUsingApp": "أكثر من 50 مدرسة تستخدم TaalimFlow",
      "hero.fromAllOverAlgeria": "من جميع أنحاء الجزائر",
      "hero.schoolLocation": "مدرسة",
      "hero.schoolsConnected": "مدرسة متصلة",
      "hero.activeUsers": "مستخدم نشط",
      "hero.newUsersDaily": "ينضم إلينا مستخدمون جدد يومياً",
      "hero.startNow": "ابدأ الآن",
      "hero.bookDemo": "احجز عرضاً تجريبياً",
      "hero.loading": "جاري التحميل...",

      // Dashboard Preview
      "dashboard.studentsToday": "عدد المستخدمين المسجلين",
      "dashboard.activeGroups": "المجموعات النشطة",
      "dashboard.newMessages": "الرسائل الجديدة",

      // Features Section
      "features.title": "ممیزات شاملة لإدارة مدرستك",
      "features.description":
        "كل ما تحتاجه لإدارة مدرسة عصرية في منصة واحدة سهلة الاستخدام",
      "features.studentPortal.title": "بوابة الطلاب والأولياء",
      "features.studentPortal.description":
        "تتبع الحضور والغياب، متابعة المجموعات، والتواصل المباشر مع الإدارة والأساتذة",
      "features.communication.title": "نظام التواصل",
      "features.communication.description":
        "رسائل فورية بين الأساتذة والطلاب والأولياء مع إشعارات ذكية",
      "features.management.title": "أدوات إدارية",
      "features.management.description":
        "إدارة الموظفين، المجموعات، والمدفوعات بواجهة سهلة ومتطورة",
      "features.languages.title": "دعم اللغات",
      "features.languages.description":
        "واجهة باللغتين العربية والفرنسية مع دعم كامل للكتابة من اليمين لليسار",
      "features.qrCards.title": "بطاقات QR للطلاب",
      "features.qrCards.description":
        "تسجيل حضور سريع وآمن باستخدام رموز QR الفريدة لكل طالب",

      // Benefits Section
      "benefits.title": "فوائد لكل مستخدم",
      "benefits.description": "حلول مخصصة لكل دور في المؤسسة التعليمية",
      "benefits.schools.title": "للمدارس",
      "benefits.schools.feature1": "إدارة مبسطة لعدة فروع",
      "benefits.schools.feature2": "تقارير شاملة ومفصلة",
      "benefits.schools.feature3": "أمان البيانات والخصوصية",
      "benefits.schools.feature4": "توفير في التكاليف التشغيلية",
      "benefits.teachers.title": "للأساتذة",
      "benefits.teachers.feature1": "التواصل المباشر مع الأولياء",
      "benefits.teachers.feature2": "متابعة تقدم الطلاب",
      "benefits.students.title": "للطلاب والأولياء",
      "benefits.students.feature1": "متابعة فورية للحضور",
      "benefits.students.feature2": "تتبع المدفوعات والرسوم",
      "benefits.students.feature3": "إشعارات ذكية ومخصصة",
      "benefits.students.feature4": "واجهة سهلة ومناسبة للجميع",

      // Trust Section
      "trust.title": "لماذا تثق بنا المدارس؟",
      "trust.dataIsolation.title": "عزل البيانات",
      "trust.dataIsolation.description":
        "كل مدرسة لها قاعدة بيانات منفصلة ومحمية",
      "trust.algeriaCompliance.title": "متوافق مع النظام الدراسي الجزائري",
      "trust.algeriaCompliance.description":
        "مصمم خصيصاً للنظام التعليمي الجزائري",
      "trust.rtlSupport.title": "دعم كامل للعربية",
      "trust.rtlSupport.description": "واجهة مصممة خصيصاً للغة العربية",

      // How It Works Section
      "howItWorks.title": "كيف يعمل TaalimFlow؟",
      "howItWorks.description": "ثلاث خطوات بسيطة للبدء",
      "howItWorks.step1.title": "سجل مدرستك",
      "howItWorks.step1.description":
        "أنشئ حساباً لمدرستك واحصل على مفتاح الوصول الخاص بك",
      "howItWorks.step2.title": "أضف المستخدمين",
      "howItWorks.step2.description":
        "أضف الإداريين والأساتذة والطلاب إلى النظام",
      "howItWorks.step3.title": "ابدأ الإدارة",
      "howItWorks.step3.description":
        "ابدأ في إدارة الحضور والمجموعات والمدفوعات والتواصل",

      // Pricing Section
      "pricing.title": "خطط الأسعار",
      "pricing.description":
        "اختر الخطة المناسبة لمدرستك وابدأ رحلتك الرقمية اليوم",
      "pricing.currency": "دج",
      "pricing.setup": "تسطيب",
      "pricing.yearly": "اشتراك سنوي",
      "pricing.popular": "الأكثر شعبية",
      "pricing.startNow": "ابدأ الآن",
      "pricing.faq.title": "الأسئلة الشائعة",
      "pricing.faq.description": "إجابات على أهم الأسئلة حول خطط الأسعار",
      "pricing.faq.q1": "هل يمكنني تغيير الخطة لاحقاً؟",
      "pricing.faq.a1":
        "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت حسب احتياجات مدرستك",
      "pricing.faq.q2": "ما هي مدة التجربة المجانية؟",
      "pricing.faq.a2":
        "التجربة المجانية تستمر لمدة أسبوع كامل مع إمكانية الوصول لجميع الميزات الأساسية",
      "pricing.faq.q3": "هل يشمل السعر الدعم الفني؟",
      "pricing.faq.a3":
        "نعم، جميع الخطط تشمل الدعم الفني، مع أولوية أعلى للخطط المتقدمة",
      "pricing.cta.title": "جاهز للبدء؟",
      "pricing.cta.description":
        "تواصل معنا اليوم واحصل على استشارة مجانية لاختيار الخطة المناسبة",
      "pricing.cta.button": "تواصل معنا الآن",
      // Phone Carousel translations - Based on image names
      "phoneCarousel.mainScreen": "🏠 الشاشة الرئيسية - مركز التحكم الذكي",
      "phoneCarousel.profile": "👤 الملف الشخصي - إدارة البيانات والإعدادات",
      "phoneCarousel.children": "🧒 إدارة الأطفال - متابعة شاملة للطلاب",
      "phoneCarousel.teacher": "👨‍🏫 بوابة المعلم - أدوات التدريس المتقدمة",
      "phoneCarousel.groups": "👥 المجموعات - تنظيم الصفوف والفرق",
      "phoneCarousel.courses": "📚 المقررات - إدارة المناهج الدراسية",
      "phoneCarousel.messages": "💬 الرسائل - تواصل فوري وآمن",
      "phoneCarousel.timeTable": "📅 الجدول الزمني - تنظيم المواعيد والحصص",
      "phoneCarousel.announcements": "📢 الإعلانات - أخبار وتحديثات فورية",
      "phoneCarousel.blog": "📰 المدونة - محتوى تعليمي وأخبار",
      "phoneCarousel.administration": "⚙️ الإدارة - تحكم كامل في النظام",
      "phoneCarousel.createAccPage": "🆕 إنشاء الحساب - انضم للمنصة بسهولة",

      // Mac Carousel translations - Desktop features
      "carousel.aboutSchool": "إدارة معلومات المدرسة مع ملفات وإشراف مفصل",
      "carousel.blockAndReport": "أدوات للحظر والإبلاغ عن المستخدمين",
      "carousel.blog": "مدونة مدمجة للأخبار والمحتوى التعليمي",
      "carousel.contentManagement": "تنظيم الدروس والوثائق والوسائط بسهولة",
      "carousel.courseRegistrations": "تسجيل مبسط مع التحقق من المتطلبات",
      "carousel.courseRegistrationDashboard": "لوحة تسجيل لحظية بالإحصائيات",
      "carousel.courseRegistrationProcess": "تسجيل خطوة بخطوة مع تحقق",
      "carousel.groupManagement": "إنشاء وإدارة الصفوف والمجموعات",
      "carousel.groupsOverview": "نظرة عامة مع إحصائيات وأداء",
      "carousel.mainDashboard": "مركز رئيسي للبيانات والتنبيهات",
      "carousel.messages": "مراسلة آمنة بين الطلاب والمعلمين",
      "carousel.parentProfile": "بوابة للأهالي لمتابعة التقدم والتقارير",
      "carousel.dataTables": "جداول متقدمة للبيانات والتقارير",
      "carousel.teachersManagement": "إدارة المعلمين والجداول والمهام",
      "carousel.usersManagement": "إدارة المستخدمين مع أدوار وصلاحيات",
      "carousel.customizableSettings": "إعدادات قابلة للتخصيص",
      "carousel.title": "استكشف مميزات النظام",
      "carousel.subtitle": "اكتشف كيف يمكن لـ Taalim Flow تبسيط إدارة مدرستك أو مركز التدريب",
      "features.carousel.title": "المميزات",
      "features.subtitle": "اكتشف كيف يبدو تطبيق OnSchool على الهاتف المحمول",
      "loading": "جاري التحميل",

      // Contact Section
      "contact.title": "تواصل معنا",
      "contact.description":
        "هل لديك أسئلة؟ نحن هنا لمساعدتك في بدء رحلتك الرقمية",
      "contact.phone": "الهاتف",
      "contact.whatsapp": "واتساب",
      "contact.email": "البريد الإلكتروني",
      "contact.form.title": "أرسل لنا رسالة",
      "contact.form.description": "سنتواصل معك خلال 24 ساعة",
      "contact.form.name": "الاسم",
      "contact.form.namePlaceholder": "اسمك الكامل",
      "contact.form.email": "البريد الإلكتروني",
      "contact.form.emailPlaceholder": "email@example.com",
      "contact.form.phone": "رقم الهاتف",
      "contact.form.phonePlaceholder": "مثال: 0555 12 34 56",
      "contact.form.schoolName": "اسم المدرسة",
      "contact.form.schoolNamePlaceholder": "اسم مدرستك أو مركز التدريب",
      "contact.form.message": "الرسالة",
      "contact.form.messagePlaceholder": "أخبرنا عن احتياجاتك...",
      "contact.form.submit": "احجز جلسة تعريفية",
      "contact.form.submitting": "جاري الإرسال...",
      "contact.form.success":
        "تم إرسال رسالتك بنجاح! سنعود إليك قريباً.",
      "contact.form.successTitle": "شكراً لك! 🎉",
      "contact.form.successMessage":
        "تم استلام رسالتك بنجاح وسنتواصل معك قريباً",
      "contact.form.appreciation": "نقدر اهتمامك بنا",
      "contact.form.characters": "حرف",
      "contact.form.requiredFields": "الحقول المطلوبة",
      "contact.form.nameRequired": "الاسم مطلوب",
      "contact.form.emailRequired": "البريد الإلكتروني مطلوب",
      "contact.form.emailInvalid": "البريد الإلكتروني غير صحيح",
      "contact.form.schoolNameRequired": "اسم المدرسة مطلوب",
      "contact.form.messageRequired": "الرسالة مطلوبة",
      "contact.form.error":
        "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",

      // Footer
      "footer.title": "TaalimFlow",
      "footer.description":
        "منصة إدارة مدرسية متطورة للمدارس الخاصة ومراكز التدريب",
      "footer.features.title": "المميزات",
      "footer.features.studentManagement": "إدارة الطلاب",
      "footer.features.attendanceTracking": "تتبع الحضور",
      "footer.features.paymentSystem": "نظام المدفوعات",
      "footer.features.communication": "التواصل",
      "footer.about.title": "حول",
      "footer.about.aboutUs": "من نحن",
      "footer.about.faq": "الأسئلة الشائعة",
      "footer.about.support": "الدعم الفني",
      "footer.about.privacy": "الخصوصية",
      "footer.technical.title": "المتطلبات التقنية",
      "footer.technical.worksOnAnyDevice": "يعمل على الهاتف والكمبيوتر",
      "footer.technical.compatibleWithAllBrowsers": "متوافق مع جميع المتصفحات",
      "footer.technical.noInstallationRequired": "لا يتطلب تثبيت تطبيقات",
      "footer.copyright": "جميع الحقوق محفوظة.",

      // Theme Toggle
      "theme.toggleToDark": "تبديل إلى الوضع المظلم",
      "theme.toggleToLight": "تبديل إلى الوضع المضيء",
      "theme.toggle": "تبديل الوضع",

      // Admin Dashboard
      "admin.title": "لوحة التحكم الإدارية",
      "admin.description":
        "إدارة ومتابعة جميع طلبات التواصل والعملاء المحتملين",
      "admin.loading": "جاري التحميل...",
      "admin.stats.totalLeads": "إجمالي الطلبات",
      "admin.stats.newLeads": "طلبات جديدة",
      "admin.stats.contacted": "تم التواصل",
      "admin.stats.today": "اليوم",
      "admin.search.placeholder":
        "البحث في الاسم، البريد الإلكتروني، المدرسة أو الرسالة...",
      "admin.filter.allStatus": "جميع الحالات",
      "admin.filter.new": "جديد",
      "admin.filter.contacted": "تم التواصل",
      "admin.filter.qualified": "مؤهل",
      "admin.filter.closed": "مغلق",
      "admin.export": "تصدير CSV",
      "admin.table.name": "الاسم",
      "admin.table.email": "البريد الإلكتروني",
      "admin.table.school": "المدرسة",
      "admin.table.status": "الحالة",
      "admin.table.date": "التاريخ",
      "admin.table.actions": "الإجراءات",
      "admin.status.new": "جديد",
      "admin.status.contacted": "تم التواصل",
      "admin.status.qualified": "مؤهل",
      "admin.status.closed": "مغلق",
      "admin.pagination.showing":
        "عرض {{start}} إلى {{end}} من {{total}} نتيجة",
      "admin.modal.title": "تفاصيل الطلب",
      "admin.modal.name": "الاسم",
      "admin.modal.email": "البريد الإلكتروني",
      "admin.modal.school": "المدرسة",
      "admin.modal.message": "الرسالة",
      "admin.modal.status": "الحالة",
      "admin.modal.date": "تاريخ الإرسال",
      "admin.modal.sendEmail": "إرسال بريد إلكتروني",
      "admin.migrate": "ترحيل البيانات",
      "admin.migrate.description":
        "تأكد من أن جميع البيانات تحتوي على الحقول المطلوبة",

      // Download Section
      "download.title": "حمل تطبيق TaalimFlow",
      "download.subtitle": "استمتع بتجربة كاملة مع تطبيقاتنا المخصصة للجوال وسطح المكتب",
      "download.mobile": "للهاتف المحمول",
      "download.desktop": "لسطح المكتب",
      "download.ios": "تحميل لـ iOS",
      "download.android": "تحميل لـ Android",
      "download.windows": "تحميل لـ Windows",
      "download.mac": "تحميل لـ Mac",
      "download.linux": "تحميل لـ Linux",
      "download.comingSoon": "قريباً",
      "download.description": "احصل على الوصول الكامل لجميع ميزات TaalimFlow في أي مكان وزمان",

      // Download Links Management
      "admin.downloadLinks.title": "إدارة روابط التحميل",
      "admin.downloadLinks.description": "تحديث روابط تحميل التطبيقات للجوال وسطح المكتب",
      "admin.downloadLinks.mobile": "تطبيقات الجوال",
      "admin.downloadLinks.desktop": "تطبيقات سطح المكتب",
      "admin.downloadLinks.url": "رابط التحميل",
      "admin.downloadLinks.enabled": "مفعل",
      "admin.downloadLinks.comingSoon": "قريباً",
      "admin.downloadLinks.save": "حفظ التغييرات",
      "admin.downloadLinks.saved": "تم حفظ الروابط بنجاح",
      "admin.downloadLinks.error": "فشل في حفظ الروابط",
    },
  },
  fr: {
    translation: {
      // Header
      "header.home": "Accueil",
      "header.features": "Fonctionnalités",
      "header.benefits": "Avantages",
      "header.howItWorks": "Comment ça marche",
      "header.pricing": "Tarifs",
      "header.contact": "Contact",
      "header.admin": "Tableau de bord",
      "header.getStarted": "get started- fr", // TOCHANGE
      "header.title": "Taalim Flow",
      "header.subtitle": "Gestion intelligente d'école",


      // Hero Section
      "hero.title": "Transformez votre école",
      "hero.subtitle": "avec Taalim Flow",
      "hero.description":
        "Une plateforme numérique complète conçue spécifiquement pour les écoles algériennes. Gérez les étudiants, suivez les présences, facilitez la communication et gérez les paiements en un seul endroit.",
      "hero.schoolsUsingApp": "Plus de 50 écoles utilisent TaalimFlow en Algérie",
      "hero.fromAllOverAlgeria": "De tout l'Algérie",
      "hero.schoolLocation": "École",
      "hero.schoolsConnected": "École connectée",
      "hero.activeUsers": "utilisateur actif",
      "hero.newUsersDaily":
        "De nouveaux utilisateurs nous rejoignent quotidiennement",
      "hero.startNow": "Commencer maintenant",
      "hero.bookDemo": "Réserver une démo",
      "hero.loading": "Chargement...",

      // Dashboard Preview
      "dashboard.studentsToday": "Étudiants présents aujourd'hui",
      "dashboard.activeGroups": "Groupes actifs",
      "dashboard.newMessages": "Nouveaux messages",

      // Features Section
      "features.title": "Fonctionnalités complètes pour gérer votre école",
      "features.description":
        "Tout ce dont vous avez besoin pour gérer une école moderne sur une seule plateforme facile à utiliser",
      "features.studentPortal.title": "Portail étudiants et parents",
      "features.studentPortal.description":
        "Suivi des présences et absences, suivi des groupes, et communication directe avec l'administration et les enseignants",
      "features.communication.title": "Système de communication",
      "features.communication.description":
        "Messages instantanés entre enseignants, étudiants et parents avec notifications intelligentes",
      "features.management.title": "Outils administratifs",
      "features.management.description":
        "Gestion du personnel, des groupes et des paiements avec une interface simple et avancée",
      "features.languages.title": "Support multilingue",
      "features.languages.description":
        "Interface en arabe et français avec support complet de l'écriture de droite à gauche",
      "features.qrCards.title": "Cartes QR pour étudiants",
      "features.qrCards.description":
        "Enregistrement de présence rapide et sécurisé avec des codes QR uniques pour chaque étudiant",

      // Benefits Section
      "benefits.title": "Avantages pour chaque utilisateur",
      "benefits.description":
        "Solutions personnalisées pour chaque rôle dans l'établissement éducatif",
      "benefits.schools.title": "Pour les écoles",
      "benefits.schools.feature1":
        "Gestion simplifiée de plusieurs succursales",
      "benefits.schools.feature2": "Rapports complets et détaillés",
      "benefits.schools.feature3": "Sécurité et confidentialité des données",
      "benefits.schools.feature4": "Économies sur les coûts opérationnels",
      "benefits.teachers.title": "Pour les enseignants",
      "benefits.teachers.feature1": "Communication directe avec les parents",
      "benefits.teachers.feature2": "Suivi des progrès des étudiants",
      "benefits.students.title": "Pour les étudiants et parents",
      "benefits.students.feature1": "Suivi instantané des présences",
      "benefits.students.feature2": "Suivi des paiements et frais",
      "benefits.students.feature3":
        "Notifications intelligentes et personnalisées",
      "benefits.students.feature4": "Interface simple et adaptée à tous",

      // Trust Section
      "trust.title": "Pourquoi les écoles nous font confiance ?",
      "trust.dataIsolation.title": "Isolation des données",
      "trust.dataIsolation.description":
        "Chaque école a sa propre base de données séparée et protégée",
      "trust.algeriaCompliance.title": "Conforme à l'Algérie",
      "trust.algeriaCompliance.description":
        "Conçu spécifiquement pour le système éducatif algérien",
      "trust.rtlSupport.title": "Support RTL complet",
      "trust.rtlSupport.description":
        "Interface conçue spécifiquement pour la langue arabe",

      // How It Works Section
      "howItWorks.title": "Comment fonctionne TaalimFlow ?",
      "howItWorks.description": "Trois étapes simples pour commencer",
      "howItWorks.step1.title": "Enregistrez votre école",
      "howItWorks.step1.description":
        "Créez un compte pour votre école et obtenez votre clé d'accès privée",
      "howItWorks.step2.title": "Ajoutez les utilisateurs",
      "howItWorks.step2.description":
        "Ajoutez les administrateurs, enseignants et étudiants au système",
      "howItWorks.step3.title": "Commencez la gestion",
      "howItWorks.step3.description":
        "Commencez à gérer les présences, groupes, paiements et communications",

      // Pricing Section
      "pricing.title": "Plans tarifaires",
      "pricing.description":
        "Choisissez le plan adapté à votre école et commencez votre parcours numérique aujourd'hui",
      "pricing.currency": "DA",
      "pricing.setup": "Installation",
      "pricing.yearly": "Abonnement annuel",
      "pricing.popular": "Le plus populaire",
      "pricing.startNow": "Commencer maintenant",
      "pricing.faq.title": "Questions fréquemment posées",
      "pricing.faq.description":
        "Réponses aux questions les plus importantes sur les plans tarifaires",
      "pricing.faq.q1": "Puis-je changer de plan plus tard ?",
      "pricing.faq.a1":
        "Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment selon les besoins de votre école",
      "pricing.faq.q2": "Quelle est la durée de l'essai gratuit ?",
      "pricing.faq.a2":
        "L'essai gratuit dure une semaine complète avec accès à toutes les fonctionnalités de base",
      "pricing.faq.q3": "Le prix inclut-il le support technique ?",
      "pricing.faq.a3":
        "Oui, tous les plans incluent le support technique, avec une priorité plus élevée pour les plans avancés",
      "pricing.cta.title": "Prêt à commencer ?",
      "pricing.cta.description":
        "Contactez-nous aujourd'hui et obtenez une consultation gratuite pour choisir le plan adapté",
      "pricing.cta.button": "Contactez-nous maintenant",
      // Mac Carousel translations - Desktop features
      "carousel.aboutSchool":
        "Gérez les infos scolaires avec profils et supervision.",
      "carousel.blockAndReport":
        "Outils de blocage et signalement des utilisateurs.",
      "carousel.blog": "Blog intégré pour annonces et contenu éducatif.",
      "carousel.contentManagement":
        "Organisez documents, cours et médias facilement.",
      "carousel.courseRegistrations":
        "Inscriptions simplifiées avec vérification des prérequis.",
      "carousel.courseRegistrationDashboard":
        "Tableau de bord en temps réel des inscriptions.",
      "carousel.courseRegistrationProcess":
        "Inscription étape par étape avec validations.",
      "carousel.groupManagement": "Créez et gérez classes et cohortes.",
      "carousel.groupsOverview": "Vue d’ensemble des groupes avec stats.",
      "carousel.mainDashboard":
        "Hub central pour stats, alertes et accès rapide.",
      "carousel.messages": "Messagerie sécurisée étudiants, profs et admins.",
      "carousel.parentProfile": "Portail parents pour suivi et rapports.",
      "carousel.dataTables": "Tableaux avancés pour données et rapports.",
      "carousel.teachersManagement": "Gérez enseignants, horaires et tâches.",
      "carousel.usersManagement": "Admin utilisateurs avec rôles et accès.",
      "carousel.customizableSettings": "Paramètres personnalisables",
      // Phone Carousel translations - Based on image names
      "phoneCarousel.mainScreen": "🏠 Écran principal - centre de contrôle intelligent",
      "phoneCarousel.profile": "👤 Profil - gestion des données et paramètres",
      "phoneCarousel.children": "🧒 Gestion enfants - suivi complet des élèves",
      "phoneCarousel.teacher": "👨‍🏫 Portail enseignant - outils pédagogiques avancés",
      "phoneCarousel.groups": "👥 Groupes - organisation des classes et équipes",
      "phoneCarousel.courses": "📚 Cours - gestion des programmes scolaires",
      "phoneCarousel.messages": "💬 Messages - communication instantanée et sécurisée",
      "phoneCarousel.timeTable": "📅 Emploi du temps - organisation des horaires",
      "phoneCarousel.announcements": "📢 Annonces - nouvelles et mises à jour",
      "phoneCarousel.blog": "📰 Blog - contenu éducatif et actualités",
      "phoneCarousel.administration": "⚙️ Administration - contrôle total du système",
      "phoneCarousel.createAccPage": "🆕 Création de compte - rejoignez facilement",
      "carousel.title": "Explorez les fonctionnalités du système",
      "carousel.subtitle": "Découvrez comment TaalimFlow peut simplifier la gestion de votre école ou centre de formation",
      "features.carousel.title": "Fonctionnalités",
      "features.subtitle":
        "Découvrez à quoi ressemble l'application TaalimFlow sur les appareils mobiles",
      "loading": "Chargement",
      // Contact Section
      "contact.title": "Contactez-nous",
      "contact.description":
        "Avez-vous des questions ? Nous sommes là pour vous aider à commencer votre parcours numérique",
      "contact.phone": "Téléphone",
      "contact.whatsapp": "WhatsApp",
      "contact.email": "Email",
      "contact.form.title": "Envoyez-nous un message",
      "contact.form.description": "Nous vous contacterons dans les 24 heures",
      "contact.form.name": "Nom",
      "contact.form.namePlaceholder": "Votre nom complet",
      "contact.form.email": "Email",
      "contact.form.emailPlaceholder": "email@example.com",
      "contact.form.phone": "Numéro de téléphone",
      "contact.form.phonePlaceholder": "Exemple: 0555 12 34 56",
      "contact.form.schoolName": "Nom de l'école",
      "contact.form.schoolNamePlaceholder":
        "Nom de votre école ou centre de formation",
      "contact.form.message": "Message",
      "contact.form.messagePlaceholder": "Parlez-nous de vos besoins...",
      "contact.form.submit": "Réserver une session d'information",
      "contact.form.submitting": "Envoi en cours...",
      "contact.form.success":
        "Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.",
      "contact.form.successTitle": "Merci ! 🎉",
      "contact.form.successMessage":
        "Votre message a été reçu avec succès et nous vous contacterons bientôt",
      "contact.form.appreciation": "Nous apprécions votre intérêt",
      "contact.form.characters": "caractères",
      "contact.form.requiredFields": "Champs obligatoires",
      "contact.form.nameRequired": "Le nom est requis",
      "contact.form.emailRequired": "L'email est requis",
      "contact.form.emailInvalid": "L'email n'est pas valide",
      "contact.form.schoolNameRequired": "Le nom de l'école est requis",
      "contact.form.messageRequired": "Le message est requis",
      "contact.form.error":
        "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",

      // Footer
      "footer.title": "Taalim Flow",
      "footer.description":
        "Plateforme de gestion scolaire avancée pour écoles privées et centres de formation",
      "footer.features.title": "Fonctionnalités",
      "footer.features.studentManagement": "Gestion des étudiants",
      "footer.features.attendanceTracking": "Suivi des présences",
      "footer.features.paymentSystem": "Système de paiement",
      "footer.features.communication": "Communication",
      "footer.about.title": "À propos",
      "footer.about.aboutUs": "Qui sommes-nous",
      "footer.about.faq": "FAQ",
      "footer.about.support": "Support technique",
      "footer.about.privacy": "Confidentialité",
      "footer.technical.title": "Exigences techniques",
      "footer.technical.worksOnAnyDevice":
        "Fonctionne sur téléphone et tablette",
      "footer.technical.compatibleWithAllBrowsers":
        "Compatible avec tous les navigateurs",
      "footer.technical.noInstallationRequired":
        "Aucune installation d'application requise",
      "footer.copyright": "Tous droits réservés.",

      // Theme Toggle
      "theme.toggleToDark": "Basculer vers le mode sombre",
      "theme.toggleToLight": "Basculer vers le mode clair",
      "theme.toggle": "Basculer le thème",

      // Admin Dashboard
      "admin.title": "Tableau de bord administratif",
      "admin.description":
        "Gérer et suivre toutes les demandes de contact et prospects",
      "admin.loading": "Chargement...",
      "admin.stats.totalLeads": "Total des prospects",
      "admin.stats.newLeads": "Nouveaux prospects",
      "admin.stats.contacted": "Contactés",
      "admin.stats.today": "Aujourd'hui",
      "admin.search.placeholder":
        "Rechercher dans le nom, email, école ou message...",
      "admin.filter.allStatus": "Tous les statuts",
      "admin.filter.new": "Nouveau",
      "admin.filter.contacted": "Contacté",
      "admin.filter.qualified": "Qualifié",
      "admin.filter.closed": "Fermé",
      "admin.export": "Exporter CSV",
      "admin.table.name": "Nom",
      "admin.table.email": "Email",
      "admin.table.school": "École",
      "admin.table.status": "Statut",
      "admin.table.date": "Date",
      "admin.table.actions": "Actions",
      "admin.status.new": "Nouveau",
      "admin.status.contacted": "Contacté",
      "admin.status.qualified": "Qualifié",
      "admin.status.closed": "Fermé",
      "admin.pagination.showing":
        "Affichage de {{start}} à {{end}} sur {{total}} résultats",
      "admin.modal.title": "Détails du prospect",
      "admin.modal.name": "Nom",
      "admin.modal.email": "Email",
      "admin.modal.school": "École",
      "admin.modal.message": "Message",
      "admin.modal.status": "Statut",
      "admin.modal.date": "Date d'envoi",
      "admin.modal.sendEmail": "Envoyer un email",
      "admin.migrate": "Migrer les données",
      "admin.migrate.description":
        "S'assurer que toutes les données ont les champs requis",

      // Download Section
      "download.title": "Télécharger l'app TaalimFlow",
      "download.subtitle": "Profitez d'une expérience complète avec nos applications dédiées mobile et bureau",
      "download.mobile": "Mobile",
      "download.desktop": "Bureau",
      "download.ios": "Télécharger pour iOS",
      "download.android": "Télécharger pour Android",
      "download.windows": "Télécharger pour Windows",
      "download.mac": "Télécharger pour Mac",
      "download.linux": "Télécharger pour Linux",
      "download.comingSoon": "Bientôt disponible",
      "download.description": "Accédez à toutes les fonctionnalités de TaalimFlow n'importe où, n'importe quand",

      // Download Links Management
      "admin.downloadLinks.title": "Gestion des liens de téléchargement",
      "admin.downloadLinks.description": "Mettre à jour les liens de téléchargement des applications mobiles et bureau",
      "admin.downloadLinks.mobile": "Applications mobiles",
      "admin.downloadLinks.desktop": "Applications bureau",
      "admin.downloadLinks.url": "Lien de téléchargement",
      "admin.downloadLinks.enabled": "Activé",
      "admin.downloadLinks.comingSoon": "Bientôt disponible",
      "admin.downloadLinks.save": "Sauvegarder les modifications",
      "admin.downloadLinks.saved": "Liens sauvegardés avec succès",
      "admin.downloadLinks.error": "Échec de la sauvegarde des liens",
    },
  },
  en: {
    translation: {
      // Carousel Section  
      "carousel.title": "Explore System Features",
      "carousel.subtitle": "See how TaalimFlow can simplify managing your school or training center",

      // Header
      "header.home": "Home",
      "header.features": "Features",
      "header.benefits": "Benefits",
      "header.howItWorks": "How It Works",
      "header.pricing": "Pricing",
      "header.contact": "Contact",
      "header.admin": "Admin Dashboard",
      "header.getStarted": "get started",
      "header.title": "Taalim Flow",
      "header.subtitle": "Smart School Management",


      // Hero Section
      "hero.title": "Transform Your School",
      "hero.subtitle": "with Taalim Flow",
      "hero.description":
        "A comprehensive digital platform designed specifically for Algerian schools. Manage students, track attendance, facilitate communication, and handle payments all in one place.",
      "hero.schoolsUsingApp": "More than 50 schools use TaalimFlow in Algeria",
      "hero.fromAllOverAlgeria": "From all over Algeria",
      "hero.schoolLocation": "School",
      "hero.schoolsConnected": "Connected school",
      "hero.activeUsers": "active user",
      "hero.newUsersDaily": "New users join us daily",
      "hero.startNow": "Start Now",
      "hero.bookDemo": "Book a Demo",
      "hero.loading": "Loading...",

      // Dashboard Preview
      "dashboard.studentsToday": "Students present today",
      "dashboard.activeGroups": "Active groups",
      "dashboard.newMessages": "New messages",

      // Features Section
      "features.title": "Comprehensive Features for Managing Your School",
      "features.description":
        "Everything you need to manage a modern school on one easy-to-use platform",
      "features.studentPortal.title": "Student & Parent Portal",
      "features.studentPortal.description":
        "Track attendance and absences, monitor groups, and direct communication with administration and teachers",
      "features.communication.title": "Communication System",
      "features.communication.description":
        "Instant messaging between teachers, students and parents with smart notifications",
      "features.management.title": "Administrative Tools",
      "features.management.description":
        "Manage staff, groups, and payments with a simple and advanced interface",
      "features.languages.title": "Language Support",
      "features.languages.description":
        "Interface in Arabic and French with full right-to-left writing support",
      "features.qrCards.title": "QR Cards for Students",
      "features.qrCards.description":
        "Quick and secure attendance recording using unique QR codes for each student",

      // Benefits Section
      "benefits.title": "Benefits for Every User",
      "benefits.description":
        "Customized solutions for every role in the educational institution",
      "benefits.schools.title": "For Schools",
      "benefits.schools.feature1": "Simplified management of multiple branches",
      "benefits.schools.feature2": "Comprehensive and detailed reports",
      "benefits.schools.feature3": "Data security and privacy",
      "benefits.schools.feature4": "Savings on operational costs",
      "benefits.teachers.title": "For Teachers",
      "benefits.teachers.feature1": "Direct communication with parents",
      "benefits.teachers.feature2": "Student progress tracking",
      "benefits.students.title": "For Students & Parents",
      "benefits.students.feature1": "Instant attendance tracking",
      "benefits.students.feature2": "Payment and fee tracking",
      "benefits.students.feature3": "Smart and personalized notifications",
      "benefits.students.feature4": "Simple interface suitable for everyone",

      // Trust Section
      "trust.title": "Why Do Schools Trust Us?",
      "trust.dataIsolation.title": "Data Isolation",
      "trust.dataIsolation.description":
        "Each school has its own separate and protected database",
      "trust.algeriaCompliance.title": "Algeria Compliant",
      "trust.algeriaCompliance.description":
        "Designed specifically for the Algerian educational system",
      "trust.rtlSupport.title": "Full RTL Support",
      "trust.rtlSupport.description":
        "Interface designed specifically for Arabic language",

      // How It Works Section
      "howItWorks.title": "How Does TaalimFlow Work?",
      "howItWorks.description": "Three simple steps to get started",
      "howItWorks.step1.title": "Register Your School",
      "howItWorks.step1.description":
        "Create an account for your school and get your private access key",
      "howItWorks.step2.title": "Add Users",
      "howItWorks.step2.description":
        "Add administrators, teachers and students to the system",
      "howItWorks.step3.title": "Start Managing",
      "howItWorks.step3.description":
        "Start managing attendance, groups, payments and communications",

      // Pricing Section
      "pricing.title": "Pricing Plans",
      "pricing.description":
        "Choose the right plan for your school and start your digital journey today",
      "pricing.currency": "DZD",
      "pricing.setup": "Setup",
      "pricing.yearly": "Annual subscription",
      "pricing.popular": "Most Popular",
      "pricing.startNow": "Start Now",
      "pricing.faq.title": "Frequently Asked Questions",
      "pricing.faq.description":
        "Answers to the most important questions about pricing plans",
      "pricing.faq.q1": "Can I change my plan later?",
      "pricing.faq.a1":
        "Yes, you can upgrade or downgrade your plan at any time according to your school's needs",
      "pricing.faq.q2": "How long is the free trial?",
      "pricing.faq.a2":
        "The free trial lasts for a full week with access to all basic features",
      "pricing.faq.q3": "Does the price include technical support?",
      "pricing.faq.a3":
        "Yes, all plans include technical support, with higher priority for advanced plans",
      "pricing.cta.title": "Ready to get started?",
      "pricing.cta.description":
        "Contact us today and get a free consultation to choose the right plan",
      "pricing.cta.button": "Contact us now",
      // Mac Carousel translations - Desktop features
      "carousel.aboutSchool":
        "Manage school info with detailed profiles and oversight.",
      "carousel.blockAndReport":
        "Moderation tools for blocking and reporting users.",
      "carousel.blog": "Built-in blog for news, updates, and learning content.",
      "carousel.contentManagement":
        "Organize documents, lessons, and media easily.",
      "carousel.courseRegistrations":
        "Simplified course enrollment with prerequisites check.",
      "carousel.courseRegistrationDashboard":
        "Real-time dashboard for enrollment stats.",
      "carousel.courseRegistrationProcess":
        "Step-by-step registration with validation.",
      "carousel.groupManagement":
        "Tools to create and manage classes or cohorts.",
      "carousel.groupsOverview":
        "Overview of groups with stats and performance.",
      "carousel.mainDashboard":
        "Central hub for metrics, alerts, and quick access.",
      "carousel.messages":
        "Secure messaging between students, teachers, and staff.",
      "carousel.parentProfile":
        "Parent portal for tracking progress and reports.",
      "carousel.dataTables": "Advanced tables for big data and reports.",
      "carousel.teachersManagement":
        "Manage teachers, schedules, and assignments.",
      "carousel.usersManagement": "User admin with roles and access control.",
      "carousel.customizableSettings": "Customizable Settings",
      // Phone Carousel translations - Based on image names
      "phoneCarousel.mainScreen": "🏠 Main screen - smart control center",
      "phoneCarousel.profile": "👤 Profile - manage your data and settings",
      "phoneCarousel.children": "🧒 Children management - comprehensive student tracking",
      "phoneCarousel.teacher": "👨‍🏫 Teacher portal - advanced teaching tools",
      "phoneCarousel.groups": "👥 Groups - organize classes and teams",
      "phoneCarousel.courses": "📚 Courses - manage academic programs",
      "phoneCarousel.messages": "💬 Messages - instant and secure communication",
      "phoneCarousel.timeTable": "📅 Time table - schedule organization",
      "phoneCarousel.announcements": "📢 Announcements - news and updates",
      "phoneCarousel.blog": "📰 Blog - educational content and news",
      "phoneCarousel.administration": "⚙️ Administration - complete system control",
      "phoneCarousel.createAccPage": "🆕 Create account page - join the platform easily",
      "features.carousel.title": "Features",
      "features.subtitle":
        "Discover how the TaalimFlow app looks on mobile devices",
      "loading": "Loading",
      // Contact Section
      "contact.title": "Contact Us",
      "contact.description":
        "Have questions? We're here to help you start your digital journey",
      "contact.phone": "Phone",
      "contact.whatsapp": "WhatsApp",
      "contact.email": "Email",
      "contact.form.title": "Send us a message",
      "contact.form.description": "We'll contact you within 24 hours",
      "contact.form.name": "Name",
      "contact.form.namePlaceholder": "Your full name",
      "contact.form.email": "Email",
      "contact.form.emailPlaceholder": "email@example.com",
      "contact.form.phone": "Phone Number",
      "contact.form.phonePlaceholder": "Example: 0555 12 34 56",
      "contact.form.schoolName": "School Name",
      "contact.form.schoolNamePlaceholder":
        "Your school or training center name",
      "contact.form.message": "Message",
      "contact.form.messagePlaceholder": "Tell us about your needs...",
      "contact.form.submit": "Book an information session",
      "contact.form.submitting": "Sending...",
      "contact.form.success":
        "Your message has been sent successfully! We'll get back to you soon.",
      "contact.form.successTitle": "Thank you! 🎉",
      "contact.form.successMessage":
        "Your message has been received successfully and we'll contact you soon",
      "contact.form.appreciation": "We appreciate your interest",
      "contact.form.characters": "characters",
      "contact.form.requiredFields": "Required fields",
      "contact.form.nameRequired": "Name is required",
      "contact.form.emailRequired": "Email is required",
      "contact.form.emailInvalid": "Email is invalid",
      "contact.form.schoolNameRequired": "School name is required",
      "contact.form.messageRequired": "Message is required",
      "contact.form.error":
        "An error occurred while sending the message. Please try again.",

      // Footer
      "footer.title": "Taalim Flow",
      "footer.description":
        "Advanced school management platform for private schools and training centers",
      "footer.features.title": "Features",
      "footer.features.studentManagement": "Student management",
      "footer.features.attendanceTracking": "Attendance tracking",
      "footer.features.paymentSystem": "Payment system",
      "footer.features.communication": "Communication",
      "footer.about.title": "About",
      "footer.about.aboutUs": "About us",
      "footer.about.faq": "FAQ",
      "footer.about.support": "Technical support",
      "footer.about.privacy": "Privacy",
      "footer.technical.title": "Technical requirements",
      "footer.technical.worksOnAnyDevice": "Works on phone and tablet",
      "footer.technical.compatibleWithAllBrowsers":
        "Compatible with all browsers",
      "footer.technical.noInstallationRequired": "No app installation required",
      "footer.copyright": "All rights reserved.",

      // Theme Toggle
      "theme.toggleToDark": "Switch to dark mode",
      "theme.toggleToLight": "Switch to light mode",
      "theme.toggle": "Toggle theme",

      // Admin Dashboard
      "admin.title": "Admin Dashboard",
      "admin.description": "Manage and track all contact requests and leads",
      "admin.loading": "Loading...",
      "admin.stats.totalLeads": "Total leads",
      "admin.stats.newLeads": "New leads",
      "admin.stats.contacted": "Contacted",
      "admin.stats.today": "Today",
      "admin.search.placeholder": "Search in name, email, school or message...",
      "admin.filter.allStatus": "All status",
      "admin.filter.new": "New",
      "admin.filter.contacted": "Contacted",
      "admin.filter.qualified": "Qualified",
      "admin.filter.closed": "Closed",
      "admin.export": "Export CSV",
      "admin.table.name": "Name",
      "admin.table.email": "Email",
      "admin.table.school": "School",
      "admin.table.status": "Status",
      "admin.table.date": "Date",
      "admin.table.actions": "Actions",
      "admin.status.new": "New",
      "admin.status.contacted": "Contacted",
      "admin.status.qualified": "Qualified",
      "admin.status.closed": "Closed",
      "admin.pagination.showing":
        "Showing {{start}} to {{end}} of {{total}} results",
      "admin.modal.title": "Lead details",
      "admin.modal.name": "Name",
      "admin.modal.email": "Email",
      "admin.modal.school": "School",
      "admin.modal.message": "Message",
      "admin.modal.status": "Status",
      "admin.modal.date": "Sent date",
      "admin.modal.sendEmail": "Send email",
      "admin.migrate": "Migrate Data",
      "admin.migrate.description": "Ensure all data has required fields",

      // Download Section
      "download.title": "Download TaalimFlow App",
      "download.subtitle": "Enjoy a complete experience with our dedicated mobile and desktop applications",
      "download.mobile": "Mobile",
      "download.desktop": "Desktop",
      "download.ios": "Download for iOS",
      "download.android": "Download for Android",
      "download.windows": "Download for Windows",
      "download.mac": "Download for Mac",
      "download.linux": "Download for Linux",
      "download.comingSoon": "Coming Soon",
      "download.description": "Get full access to all TaalimFlow features anywhere, anytime",

      // Download Links Management
      "admin.downloadLinks.title": "Manage Download Links",
      "admin.downloadLinks.description": "Update download links for mobile and desktop applications",
      "admin.downloadLinks.mobile": "Mobile Apps",
      "admin.downloadLinks.desktop": "Desktop Apps",
      "admin.downloadLinks.url": "Download URL",
      "admin.downloadLinks.enabled": "Enabled",
      "admin.downloadLinks.comingSoon": "Coming Soon",
      "admin.downloadLinks.save": "Save Changes",
      "admin.downloadLinks.saved": "Links saved successfully",
      "admin.downloadLinks.error": "Failed to save links",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // Set Arabic as default language
    fallbackLng: "ar",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;