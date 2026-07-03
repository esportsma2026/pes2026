var EffotbaleLang = (function () {
  'use strict';

  var translations = {
    en: {
      nav: { home: 'Home', tournament: 'Tournament', draw: 'Draw', matches: 'Matches', faq: 'FAQ', support: 'Support' },
      hero: { title1: 'Experience', title3: 'The Ultimate Match', desc: 'Build your dream team, compete in the World Cup 2026 tournament, and rise through the ranks. The pitch awaits your legend.', cta: 'View Tournament' },
      stats: { players: 'Active Players', tournaments: 'Teams', rating: 'Groups' },
      features: { title: 'Why Play Effotbale?', subtitle: 'Experience football like never before with features designed for champions.' },
      cta: { title: 'Ready to Compete?', desc: 'Join thousands of players in the World Cup 2026 tournament.' },
      tournament: { title: 'World Cup 2026', subtitle: '48 teams, 12 groups, one champion.' },
      groups: 'Group Stage',
      bracket: 'Knockout Stage',
      draw: { title: 'Tournament Draw', desc: 'The official draw for the World Cup 2026 tournament.', launch: 'Launch Draw', saved: 'View the official tournament draw below.' },
      match: { title: 'World Cup 2026 Matches', desc: 'All matches for the World Cup 2026 tournament.' },
      faq: { title: 'Frequently Asked Questions', desc: 'Quick answers to common questions about Effotbale.' },
      support: { title: 'Support Center', desc: 'We are here to help. Reach out or find answers in our community.' },
      footer: { rights: 'All rights reserved.', tagline: 'Made for the love of football.' },
      groupMatches: 'Group Matches',
      bracketStage: 'Knockout Stage',
      matchTbd: 'To be determined',
      noDraw: 'The draw has not been conducted yet.',
      bracketUpcoming: 'Knockout stage matches will be available after the group stage.',
      team: 'Team',
      pts: 'Pts',
      hotPreview: 'Hot Preview',
      hpTournament: 'Tournament Stage',
      hpMatchesPlayed: 'matches played',
      hpGroupsDone: 'Groups Completed',
      hpGroupsOf: 'of 12 groups have all matches finished',
      hpKnockout: 'Knockout Stage',
      hpKnockoutRound: 'Current round',
      hpTeamsQualified: 'Teams Qualified',
      hpTeamsQualifiedDesc: 'teams have qualified for knockout stage',
      hpNotStarted: 'Not started',
      hpGroupProgress: 'Group stage in progress',
      howToPlay: 'How to Play',
      general: 'General',
      reportIssue: 'Report an Issue',
      sendMessage: 'Send Message',
      playerNum: 'Your Player Number',
      playerNumHint: 'Your player number is required so we can identify your account.',
      messagePlaceholder: 'Describe your issue or question in detail...',
      msgSent: 'Your message has been sent successfully!',
      knockoutBracketEmpty: 'Complete all group stage matches to unlock the knockout bracket.',
      knockoutRound32: 'Round of 32',
      knockoutRound16: 'Round of 16',
      knockoutQf: 'Quarter Finals',
      knockoutSf: 'Semi Finals',
      knockoutFinal: 'Final',
      finished: 'Finished',
      upcoming: 'Upcoming',
      group: 'Group',
      viewFullDraw: 'View full draw',
      conductDraw: 'Conduct Draw',
      roadToFinal: 'The road to the final.',
      vs: 'VS',
      winner: 'Winner',
      awaiting: 'Awaiting',
      teamTbd: 'TBD'
    },
    ar: {
      nav: { home: 'الرئيسية', tournament: 'البطولة', draw: 'القرعة', matches: 'المباريات', faq: 'الأسئلة', support: 'الدعم' },
      hero: { title1: 'اختبر', title3: 'المباراة النهائية', desc: 'ابنِ فريق أحلامك، تنافس في بطولة كأس العالم 2026، وارتقِ في التصنيف. الملعب ينتظر أسطورتك.', cta: 'عرض البطولة' },
      stats: { players: 'اللاعبون النشطون', tournaments: 'منتخب', rating: 'مجموعة' },
      features: { title: 'لماذا تلعب إيفوتبال؟', subtitle: 'اختبر كرة القدم كما لم يحدث من قبل مع ميزات صُممت للأبطال.' },
      cta: { title: 'مستعد للمنافسة؟', desc: 'انضم إلى آلاف اللاعبين في بطولة كأس العالم 2026.' },
      tournament: { title: 'كأس العالم 2026', subtitle: '48 منتخباً، 12 مجموعة، بطل واحد.' },
      groups: 'دور المجموعات',
      bracket: 'دور خروج المغلوب',
      draw: { title: 'قرعة البطولة', desc: 'القرعة الرسمية لبطولة كأس العالم 2026.', launch: 'إجراء القرعة', saved: 'عرض القرعة الرسمية للبطولة أدناه.' },
      match: { title: 'مباريات كأس العالم 2026', desc: 'جميع مباريات بطولة كأس العالم 2026.' },
      faq: { title: 'الأسئلة الشائعة', desc: 'إجابات سريعة للأسئلة الشائعة حول إيفوتبال.' },
      support: { title: 'مركز الدعم', desc: 'نحن هنا للمساعدة. تواصل معنا أو ابحث عن إجابات في مجتمعنا.' },
      footer: { rights: 'جميع الحقوق محفوظة.', tagline: 'صُنع من أجل حب كرة القدم.' },
      groupMatches: 'مباريات المجموعات',
      bracketStage: 'دور خروج المغلوب',
      matchTbd: 'سيتم تحديده',
      noDraw: 'لم يتم إجراء القرعة بعد.',
      bracketUpcoming: 'مباريات خروج المغلوب ستكون متاحة بعد دور المجموعات.',
      team: 'المنتخب',
      pts: 'نقاط',
      hotPreview: 'معاينة ساخنة',
      hpTournament: 'مرحلة البطولة',
      hpMatchesPlayed: 'مباراة لعبت',
      hpGroupsDone: 'المجموعات المكتملة',
      hpGroupsOf: 'من أصل 12 مجموعة اكتملت مبارياتها',
      hpKnockout: 'دور خروج المغلوب',
      hpKnockoutRound: 'الدور الحالي',
      hpTeamsQualified: 'المنتخبات المتأهلة',
      hpTeamsQualifiedDesc: 'منتخباً تأهلوا لدور خروج المغلوب',
      hpNotStarted: 'لم يبدأ',
      hpGroupProgress: 'دور المجموعات جار',
      howToPlay: 'كيف تلعب',
      general: 'عام',
      reportIssue: 'الإبلاغ عن مشكلة',
      sendMessage: 'إرسال الرسالة',
      playerNum: 'رقم اللاعب الخاص بك',
      playerNumHint: 'رقم اللاعب مطلوب حتى نتمكن من التعرف على حسابك.',
      messagePlaceholder: 'صف مشكلتك أو استفسارك بالتفصيل...',
      msgSent: 'تم إرسال رسالتك بنجاح!',
      knockoutBracketEmpty: 'أكمل جميع مباريات دور المجموعات لفتح مرحلة خروج المغلوب.',
      knockoutRound32: 'دور الـ32',
      knockoutRound16: 'دور الـ16',
      knockoutQf: 'ربع النهائي',
      knockoutSf: 'نصف النهائي',
      knockoutFinal: 'النهائي',
      finished: 'انتهت',
      upcoming: 'قادمة',
      group: 'المجموعة',
      viewFullDraw: 'عرض القرعة كاملة',
      conductDraw: 'إجراء القرعة',
      roadToFinal: 'الطريق إلى النهائي.',
      vs: 'ضد',
      winner: 'الفائز',
      awaiting: 'في الانتظار',
      teamTbd: 'سيتم تحديده'
    }
  };

  var currentLang = localStorage.getItem('effotbale_lang') || 'en';

  function t(key) {
    var parts = key.split('.');
    var val = translations[currentLang];
    for (var i = 0; i < parts.length; i++) {
      if (val) val = val[parts[i]];
    }
    return val !== undefined ? val : key;
  }

  function setLang(lang) {
    if (translations[lang]) {
      currentLang = lang;
      localStorage.setItem('effotbale_lang', lang);
      document.querySelector('html').setAttribute('lang', lang === 'ar' ? 'ar' : 'en');
      if (lang === 'ar') {
        document.querySelector('html').setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
      } else {
        document.querySelector('html').removeAttribute('dir');
        document.body.classList.remove('rtl');
      }
      translatePage();
      var event = new CustomEvent('languageChanged', { detail: { lang: lang } });
      document.dispatchEvent(event);
    }
  }

  function getLang() {
    return currentLang;
  }

  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      if (val !== key) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', val);
        } else if (el.tagName === 'SPAN' && el.parentElement && el.parentElement.getAttribute('data-i18n-keep')) {
          el.textContent = val;
        } else {
          el.textContent = val;
        }
      }
    });
    var langBtn = document.getElementById('langToggle');
    if (langBtn) {
      langBtn.textContent = currentLang === 'en' ? 'العربية' : 'English';
    }
  }

  return {
    t: t,
    setLang: setLang,
    getLang: getLang,
    translatePage: translatePage,
    translations: translations
  };
})();

(function () {
  var lang = localStorage.getItem('effotbale_lang');
  if (lang === 'ar') {
    document.querySelector('html').setAttribute('dir', 'rtl');
    document.querySelector('html').setAttribute('lang', 'ar');
    document.body.classList.add('rtl');
  }
})();
