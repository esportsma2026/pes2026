var EffotbaleDraw = (function () {
  'use strict';

  var COUNTRIES = [
    { id: 'brazil', name: 'Brazil', nameAr: 'البرازيل', flag: 'images/brazil.webp' },
    { id: 'portugal', name: 'Portugal', nameAr: 'البرتغال', flag: 'images/portugal.webp' },
    { id: 'france', name: 'France', nameAr: 'فرنسا', flag: 'images/france.webp' },
    { id: 'morocco', name: 'Morocco', nameAr: 'المغرب', flag: 'images/morocco.webp' },
    { id: 'argentina', name: 'Argentina', nameAr: 'الأرجنتين', flag: 'images/argentina.webp' },
    { id: 'spain', name: 'Spain', nameAr: 'إسبانيا', flag: 'images/spain.webp' },
    { id: 'netherlands', name: 'Netherlands', nameAr: 'هولندا', flag: 'images/netherlands.webp' },
    { id: 'japan', name: 'Japan', nameAr: 'اليابان', flag: 'images/japan.webp' },
    { id: 'germany', name: 'Germany', nameAr: 'ألمانيا', flag: 'images/germany.webp' },
    { id: 'england', name: 'England', nameAr: 'إنجلترا', flag: 'images/england.webp' },
    { id: 'croatia', name: 'Croatia', nameAr: 'كرواتيا', flag: 'images/croatia.webp' },
    { id: 'saudi-arabia', name: 'Saudi Arabia', nameAr: 'السعودية', flag: 'images/saudi-arabia.webp' },
    { id: 'italy', name: 'Italy', nameAr: 'إيطاليا', flag: 'images/italy.svg' },
    { id: 'belgium', name: 'Belgium', nameAr: 'بلجيكا', flag: 'images/belgium.webp' },
    { id: 'uruguay', name: 'Uruguay', nameAr: 'الأوروغواي', flag: 'images/uruguay.webp' },
    { id: 'south-korea', name: 'South Korea', nameAr: 'كوريا الجنوبية', flag: 'images/south-korea.webp' },
    { id: 'usa', name: 'USA', nameAr: 'الولايات المتحدة', flag: 'images/usa.webp' },
    { id: 'mexico', name: 'Mexico', nameAr: 'المكسيك', flag: 'images/mexico.webp' },
    { id: 'colombia', name: 'Colombia', nameAr: 'كولومبيا', flag: 'images/colombia.webp' },
    { id: 'ghana', name: 'Ghana', nameAr: 'غانا', flag: 'images/ghana.webp' },
    { id: 'senegal', name: 'Senegal', nameAr: 'السنغال', flag: 'images/senegal.webp' },
    { id: 'cameroon', name: 'Cameroon', nameAr: 'الكاميرون', flag: 'images/cameroon.svg' },
    { id: 'nigeria', name: 'Nigeria', nameAr: 'نيجيريا', flag: 'images/nigeria.svg' },
    { id: 'egypt', name: 'Egypt', nameAr: 'مصر', flag: 'images/egypt.webp' },
    { id: 'australia', name: 'Australia', nameAr: 'أستراليا', flag: 'images/australia.webp' },
    { id: 'iran', name: 'Iran', nameAr: 'إيران', flag: 'images/iran.webp' },
    { id: 'switzerland', name: 'Switzerland', nameAr: 'سويسرا', flag: 'images/switzerland.webp' },
    { id: 'denmark', name: 'Denmark', nameAr: 'الدنمارك', flag: 'images/denmark.svg' },
    { id: 'sweden', name: 'Sweden', nameAr: 'السويد', flag: 'images/sweden.webp' },
    { id: 'poland', name: 'Poland', nameAr: 'بولندا', flag: 'images/poland.svg' },
    { id: 'serbia', name: 'Serbia', nameAr: 'صربيا', flag: 'images/serbia.svg' },
    { id: 'turkiye', name: 'Türkiye', nameAr: 'تركيا', flag: 'images/turkiye.webp' },
    { id: 'canada', name: 'Canada', nameAr: 'كندا', flag: 'images/canada.webp' },
    { id: 'algeria', name: 'Algeria', nameAr: 'الجزائر', flag: 'images/algeria.webp' },
    { id: 'tunisia', name: 'Tunisia', nameAr: 'تونس', flag: 'images/tunisia.webp' },
    { id: 'ivory-coast', name: 'Ivory Coast', nameAr: 'ساحل العاج', flag: 'images/ivory-coast.webp' },
    { id: 'ecuador', name: 'Ecuador', nameAr: 'الإكوادور', flag: 'images/ecuador.webp' },
    { id: 'peru', name: 'Peru', nameAr: 'بيرو', flag: 'images/peru.svg' },
    { id: 'new-zealand', name: 'New Zealand', nameAr: 'نيوزيلندا', flag: 'images/new-zealand.webp' },
    { id: 'qatar', name: 'Qatar', nameAr: 'قطر', flag: 'images/qatar.webp' },
    { id: 'costa-rica', name: 'Costa Rica', nameAr: 'كوستاريكا', flag: 'images/costa-rica.svg' },
    { id: 'panama', name: 'Panama', nameAr: 'بنما', flag: 'images/panama.webp' },
    { id: 'scotland', name: 'Scotland', nameAr: 'اسكتلندا', flag: 'images/scotland.webp' },
    { id: 'austria', name: 'Austria', nameAr: 'النمسا', flag: 'images/austria.webp' },
    { id: 'czech-republic', name: 'Czech Republic', nameAr: 'التشيك', flag: 'images/czech-republic.webp' },
    { id: 'norway', name: 'Norway', nameAr: 'النرويج', flag: 'images/norway.webp' },
    { id: 'south-africa', name: 'South Africa', nameAr: 'جنوب أفريقيا', flag: 'images/south-africa.webp' },
    { id: 'iraq', name: 'Iraq', nameAr: 'العراق', flag: 'images/iraq.webp' }
  ];

  var STORAGE_KEY = 'effotbale_draw_result_2026';
  var GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  function findTeam(name) {
    for (var i = 0; i < COUNTRIES.length; i++) {
      if (COUNTRIES[i].name === name) return COUNTRIES[i];
    }
    return null;
  }

  function generateDraw() {
    return {
      A: [findTeam('Argentina'), findTeam('Cameroon'), findTeam('Norway'), findTeam('Iran')],
      B: [findTeam('Brazil'), findTeam('Denmark'), findTeam('Morocco'), findTeam('Canada')],
      C: [findTeam('France'), findTeam('Japan'), findTeam('Peru'), findTeam('Algeria')],
      D: [findTeam('England'), findTeam('Croatia'), findTeam('Egypt'), findTeam('New Zealand')],
      E: [findTeam('Spain'), findTeam('Uruguay'), findTeam('Ghana'), findTeam('Czech Republic')],
      F: [findTeam('Portugal'), findTeam('Mexico'), findTeam('Saudi Arabia'), findTeam('Austria')],
      G: [findTeam('Germany'), findTeam('USA'), findTeam('Iraq'), findTeam('Costa Rica')],
      H: [findTeam('Italy'), findTeam('South Korea'), findTeam('Tunisia'), findTeam('Scotland')],
      I: [findTeam('Netherlands'), findTeam('Senegal'), findTeam('Qatar'), findTeam('Sweden')],
      J: [findTeam('Belgium'), findTeam('Colombia'), findTeam('Australia'), findTeam('Serbia')],
      K: [findTeam('Switzerland'), findTeam('Ecuador'), findTeam('South Africa'), findTeam('Nigeria')],
      L: [findTeam('Türkiye'), findTeam('Poland'), findTeam('Ivory Coast'), findTeam('Panama')]
    };
  }

  function saveDraw(draw) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draw));
      try { document.dispatchEvent(new CustomEvent('effotbaleUpdate', { detail: { type: 'draw' } })); } catch (ex) {}
      return true;
    }
    catch (e) { console.error('Failed to save draw:', e); return false; }
  }

  function loadDraw() {
    try { var data = localStorage.getItem(STORAGE_KEY); return data ? JSON.parse(data) : null; }
    catch (e) { console.error('Failed to load draw:', e); return null; }
  }

  function getOrCreateDraw() {
    var draw = generateDraw();
    saveDraw(draw);
    return draw;
  }

  function resetDraw() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function renderDraw(draw, containerId, lang) {
    var container = document.getElementById(containerId);
    if (!container) return;
    lang = lang || 'en';
    container.innerHTML = '';
    var groupKeys = Object.keys(draw).sort();

    var grid = document.createElement('div');
    grid.className = 'draw-groups draw-groups-12';

    groupKeys.forEach(function (key) {
      var teams = draw[key];
      var card = document.createElement('div');
      card.className = 'draw-group-card';

      var header = document.createElement('h3');
      header.className = 'draw-group-title';
      header.textContent = (lang === 'ar' ? 'المجموعة ' : 'Group ') + key;
      card.appendChild(header);

      var table = document.createElement('table');
      table.className = 'draw-group-table';

      var thead = document.createElement('thead');
      thead.innerHTML = '<tr><th></th><th>' + (lang === 'ar' ? 'المنتخب' : 'Team') + '</th></tr>';
      table.appendChild(thead);

      var tbody = document.createElement('tbody');
      teams.forEach(function (team, idx) {
        var name = (lang === 'ar' ? team.nameAr : team.name);
        var tr = document.createElement('tr');
        tr.innerHTML =
          '<td class="draw-flag-cell"><img src="' + team.flag + '" alt="' + name + '" class="draw-flag" loading="lazy" onerror="this.src=\'images/' + team.id + '.svg\'"></td>' +
          '<td class="draw-team-name">' + name + '</td>';
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      card.appendChild(table);
      grid.appendChild(card);
    });

    container.appendChild(grid);

    var date = document.createElement('p');
    date.className = 'draw-date';
    var now = new Date();
    var dateStr = now.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    date.textContent = (lang === 'ar' ? 'تم إجراء القرعة في ' : 'Draw conducted on ') + dateStr;
    container.appendChild(date);
  }

  function getGroupLabel(lang) {
    return lang === 'ar' ? 'المجموعة' : 'Group';
  }

  /* Generate initial match structures from draw - used by db.js */
  function generateGroupMatches(draw) {
    var matches = [];
    var groupKeys = Object.keys(draw).sort();
    var matchId = 1;
    groupKeys.forEach(function (key) {
      var teams = draw[key];
      for (var i = 0; i < teams.length; i++) {
        for (var j = i + 1; j < teams.length; j++) {
          matches.push({
            id: 'm' + matchId++,
            group: key, stage: 'group',
            teamA: teams[i].id, teamB: teams[j].id,
            nameA: teams[i].name, nameB: teams[j].name,
            nameArA: teams[i].nameAr, nameArB: teams[j].nameAr,
            flagA: teams[i].flag, flagB: teams[j].flag,
            scoreA: null, scoreB: null, status: 'upcoming'
          });
        }
      }
    });
    return matches;
  }

  function isDrawSaved() {
    return loadDraw() !== null;
  }

  return {
    COUNTRIES: COUNTRIES,
    generateDraw: generateDraw,
    saveDraw: saveDraw,
    loadDraw: loadDraw,
    getOrCreateDraw: getOrCreateDraw,
    resetDraw: resetDraw,
    renderDraw: renderDraw,
    generateGroupMatches: generateGroupMatches,
    isDrawSaved: isDrawSaved,
    GROUPS: GROUPS,
    getGroupLabel: getGroupLabel
  };
})();
