/* Effotbale Database Module
 * =========================
 * All data stored in localStorage.
 * - drawResult: The group draw
 * - matchResults: Group match scores and statuses
 * - knockoutData: Knockout bracket across all rounds
 * - playerMessages: Messages from support page
 * - lockedMatches: Match IDs locked
 * 
 * Automatic updates: When matches are saved with both scores,
 * standings, qualifications, and knockout progression update automatically.
 * Pages listen for 'effotbaleUpdate' events to re-render.
 */
var EffotbaleDB = (function () {
  'use strict';

  var KEYS = {
    DRAW: 'effotbale_draw_result_2026',
    MATCHES: 'effotbale_match_results_2026',
    KNOCKOUT: 'effotbale_knockout_2026',
    MESSAGES: 'effotbale_player_messages_2026',
    LOCKED: 'effotbale_locked_matches_2026'
  };

  /* ---------- Notification system ---------- */
  function notifyUpdate(type, detail) {
    try {
      document.dispatchEvent(new CustomEvent('effotbaleUpdate', {
        detail: { type: type || 'all', timestamp: Date.now(), data: detail || null }
      }));
    } catch (e) {}
  }

  /* ---------- Draw ---------- */
  function getDraw() {
    try { var d = localStorage.getItem(KEYS.DRAW); return d ? JSON.parse(d) : null; }
    catch (e) { return null; }
  }
  function saveDraw(draw) {
    try { localStorage.setItem(KEYS.DRAW, JSON.stringify(draw)); return true; }
    catch (e) { return false; }
  }

  /* ---------- Group Match Results ---------- */
  function getMatchResults() {
    try { var d = localStorage.getItem(KEYS.MATCHES); return d ? JSON.parse(d) : []; }
    catch (e) { return []; }
  }
  function saveMatchResults(matches) {
    try { localStorage.setItem(KEYS.MATCHES, JSON.stringify(matches)); return true; }
    catch (e) { return false; }
  }

  function initMatchResults(draw) {
    if (!draw) return [];
    var existing = getMatchResults();
    if (existing.length > 0) return existing;
    var matches = [], groupKeys = Object.keys(draw).sort(), matchId = 1;
    groupKeys.forEach(function (key) {
      var teams = draw[key];
      for (var i = 0; i < teams.length; i++) {
        for (var j = i + 1; j < teams.length; j++) {
          matches.push({
            id: 'm' + matchId++, group: key,
            teamA: teams[i].id, teamB: teams[j].id,
            nameA: teams[i].name, nameB: teams[j].name,
            nameArA: teams[i].nameAr, nameArB: teams[j].nameAr,
            flagA: teams[i].flag, flagB: teams[j].flag,
            scoreA: null, scoreB: null, status: 'upcoming'
          });
        }
      }
    });
    saveMatchResults(matches);
    notifyUpdate('matches', { init: true });
    return matches;
  }

  function updateAllMatchResults(updates) {
    var matches = getMatchResults();
    var locked = getLockedMatches();
    var changed = false;
    for (var i = 0; i < matches.length; i++) {
      for (var u = 0; u < updates.length; u++) {
        if (matches[i].id === updates[u].id) {
          if (locked.indexOf(matches[i].id) >= 0) continue;
          var sa = updates[u].scoreA !== undefined && updates[u].scoreA !== '' ? Number(updates[u].scoreA) : null;
          var sb = updates[u].scoreB !== undefined && updates[u].scoreB !== '' ? Number(updates[u].scoreB) : null;
          matches[i].scoreA = sa;
          matches[i].scoreB = sb;
          /* Auto-finish: when both scores are set, mark as finished */
          matches[i].status = (sa !== null && sb !== null) ? 'finished' : 'upcoming';
          changed = true;
          break;
        }
      }
    }
    if (changed) {
      saveMatchResults(matches);
      /* Auto-propagate: standings, qualifications, knockout */
      autoPropagate();
    }
    return changed;
  }

  /* Auto-propagate after any match change */
  function autoPropagate() {
    var matches = getMatchResults();
    var draw = getDraw();
    if (!draw || matches.length === 0) return;

    /* Check if all group matches are finished */
    var allFinished = matches.every(function (m) { return m.status === 'finished'; });

    if (allFinished) {
      var ko = getKnockoutData();
      if (!ko || !ko.r32 || ko.r32.length === 0) {
        computeKnockoutProgression();
      } else {
        computeKnockoutProgression();
      }
    }

    notifyUpdate('matches');
  }

  function setMatchStatus(matchId, status) {
    var matches = getMatchResults();
    for (var i = 0; i < matches.length; i++) {
      if (matches[i].id === matchId) {
        matches[i].status = status;
        saveMatchResults(matches);
        autoPropagate();
        return true;
      }
    }
    var ko = getKnockoutData();
    if (ko) {
      for (var r = 0; r < ROUND_ORDER.length; r++) {
        var ms = ko[ROUND_ORDER[r]];
        if (!ms) continue;
        for (var j = 0; j < ms.length; j++) {
          if (ms[j].id === matchId) {
            ms[j].status = status;
            saveKnockoutData(ko);
            notifyUpdate('knockout');
            return true;
          }
        }
      }
    }
    return false;
  }

  function getQualifiedTeams() {
    var draw = getDraw();
    if (!draw) return null;
    var matchResults = getMatchResults();
    var standings = computeStandings(draw, matchResults);
    var groupKeys = Object.keys(draw).sort();
    var first = [], second = [], third = [];
    var allGroupComplete = matchResults.length > 0 && groupKeys.every(function (k) {
      var gm = matchResults.filter(function (m) { return m.group === k && m.status === 'finished'; });
      var total = draw[k] ? draw[k].length : 4;
      return gm.length === total * (total - 1) / 2;
    });
    groupKeys.forEach(function (key) {
      var gs = standings[key] || [];
      for (var i = 0; i < Math.min(3, gs.length); i++) {
        var e = gs[i]; e._group = key;
        e._posKey = key + (i + 1);
        var allFinished = matchResults.filter(function (m) { return m.group === key; }).every(function (m) { return m.status === 'finished'; });
        if (allFinished) {
          if (i === 0) first.push(e);
          else if (i === 1) second.push(e);
          else third.push(e);
        }
      }
    });
    third.sort(function (a, b) {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
    var bestThird = third.slice(0, 8);
    return {
      first: first,
      second: second,
      bestThird: bestThird,
      thirdRanked: third,
      allComplete: allGroupComplete,
      totalQualified: first.length + second.length + bestThird.length
    };
  }

  function getBestThirdRanking() {
    var draw = getDraw();
    if (!draw) return [];
    var matchResults = getMatchResults();
    var standings = computeStandings(draw, matchResults);
    var groupKeys = Object.keys(draw).sort();
    var third = [];
    groupKeys.forEach(function (key) {
      var gs = standings[key] || [];
      if (gs.length >= 3) {
        var e = gs[2]; e._group = key;
        e._posKey = key + '3';
        var groupDone = matchResults.filter(function (m) { return m.group === key; }).every(function (m) { return m.status === 'finished'; });
        if (groupDone) third.push(e);
      }
    });
    third.sort(function (a, b) {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
    return third;
  }

  function resetMatchResults() {
    var matches = getMatchResults();
    var locked = getLockedMatches();
    for (var i = 0; i < matches.length; i++) {
      if (locked.indexOf(matches[i].id) >= 0) continue;
      matches[i].scoreA = null;
      matches[i].scoreB = null;
      matches[i].status = 'upcoming';
    }
    saveMatchResults(matches);
    autoPropagate();
    return matches;
  }

  function getGroupMatches(groupKey) {
    return getMatchResults().filter(function (m) { return m.group === groupKey; });
  }
  function getMatchById(matchId) {
    return getMatchResults().find(function (m) { return m.id === matchId; }) || null;
  }

  /* ---------- Standings ---------- */
  function computeStandings(draw, matchResults) {
    if (!draw) return {};
    var standings = {}, groupKeys = Object.keys(draw).sort();
    groupKeys.forEach(function (key) {
      var teams = draw[key], gs = {};
      teams.forEach(function (t) {
        gs[t.id] = { id: t.id, name: t.name, nameAr: t.nameAr, flag: t.flag, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
      });
      var gMatches = matchResults.filter(function (m) { return m.group === key; });
      gMatches.forEach(function (m) {
        if (m.status !== 'finished') return;
        var a = gs[m.teamA], b = gs[m.teamB];
        if (!a || !b) return;
        a.mp++; b.mp++; a.gf += m.scoreA; a.ga += m.scoreB; b.gf += m.scoreB; b.ga += m.scoreA;
        if (m.scoreA > m.scoreB) { a.w++; a.pts += 3; b.l++; }
        else if (m.scoreA < m.scoreB) { b.w++; b.pts += 3; a.l++; }
        else { a.d++; a.pts += 1; b.d++; b.pts += 1; }
      });
      Object.keys(gs).forEach(function (id) { gs[id].gd = gs[id].gf - gs[id].ga; });
      var sorted = Object.keys(gs).map(function (id) { return gs[id]; });
      sorted.sort(function (a, b) {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
      });
      standings[key] = sorted;
    });
    return standings;
  }

  /* ---------- Locked Matches ---------- */
  function getLockedMatches() {
    try { var d = localStorage.getItem(KEYS.LOCKED); return d ? JSON.parse(d) : []; }
    catch (e) { return []; }
  }
  function saveLockedMatches(l) {
    try { localStorage.setItem(KEYS.LOCKED, JSON.stringify(l)); return true; }
    catch (e) { return false; }
  }
  function toggleMatchLock(matchId) {
    var locked = getLockedMatches();
    var idx = locked.indexOf(matchId);
    if (idx >= 0) locked.splice(idx, 1); else locked.push(matchId);
    return saveLockedMatches(locked);
  }
  function isMatchLocked(matchId) {
    return getLockedMatches().indexOf(matchId) >= 0;
  }

  /* ---------- Player Messages ---------- */
  function getPlayerMessages() {
    try { var d = localStorage.getItem(KEYS.MESSAGES); return d ? JSON.parse(d) : []; }
    catch (e) { return []; }
  }
  function savePlayerMessages(msgs) {
    try { localStorage.setItem(KEYS.MESSAGES, JSON.stringify(msgs)); return true; }
    catch (e) { return false; }
  }
  function addPlayerMessage(playerNum, message) {
    var msgs = getPlayerMessages();
    msgs.push({ id: 'msg_' + Date.now(), playerNum: playerNum, message: message, timestamp: new Date().toISOString() });
    var ok = savePlayerMessages(msgs);
    if (ok) notifyUpdate('messages');
    return ok;
  }
  function clearPlayerMessages() {
    try { localStorage.removeItem(KEYS.MESSAGES); return true; }
    catch (e) { return false; }
  }

  /* ---------- Knockout Data ---------- */
  function getKnockoutData() {
    try {
      var d = localStorage.getItem(KEYS.KNOCKOUT);
      if (!d) return null;
      var data = JSON.parse(d);
      /* Migrate old single-leg data to new two-leg structure */
      if (data && data.r32 && data.r32.length > 0 && !data.r32[0].leg) {
        try { localStorage.removeItem(KEYS.KNOCKOUT); } catch (e) {}
        return null;
      }
      return data;
    }
    catch (e) { return null; }
  }
  function saveKnockoutData(data) {
    try { localStorage.setItem(KEYS.KNOCKOUT, JSON.stringify(data)); return true; }
    catch (e) { return false; }
    finally { notifyUpdate('knockout'); }
  }

  function getTieWinner(legs) {
    if (!legs || legs.length < 2) return null;
    var leg1 = legs[0], leg2 = legs[1];
    if (leg1.scoreA === null || leg1.scoreB === null || leg2.scoreA === null || leg2.scoreB === null) return null;
    if (leg1.status !== 'finished' || leg2.status !== 'finished') return null;
    var totalA = leg1.scoreA + leg2.scoreB;
    var totalB = leg1.scoreB + leg2.scoreA;
    if (totalA > totalB) return { id: leg1.teamA, name: leg1.nameA, nameAr: leg1.nameArA, flag: leg1.flagA };
    if (totalB > totalA) return { id: leg1.teamB, name: leg1.nameB, nameAr: leg1.nameArB, flag: leg1.flagB };
    return { id: leg1.teamA, name: leg1.nameA, nameAr: leg1.nameArA, flag: leg1.flagA };
  }

  function buildRound32(standings, draw) {
    var groupKeys = Object.keys(draw).sort();
    var first = [], second = [], third = [];
    groupKeys.forEach(function (key) {
      var gs = standings[key] || [];
      for (var i = 0; i < Math.min(3, gs.length); i++) {
        var e = gs[i]; e._pos = i + 1;
        if (i === 0) first.push(e);
        else if (i === 1) second.push(e);
        else third.push(e);
      }
    });
    third.sort(function (a, b) {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
    var bestThird = third.slice(0, 8);
    var qualified = [].concat(first, second, bestThird);
    qualified.sort(function (a, b) {
      if (a._pos !== b._pos) return a._pos - b._pos;
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
    var pairings = [
      [0,31],[15,16],[7,24],[8,23],[4,27],[11,20],[3,28],[12,19],
      [2,29],[13,18],[5,26],[10,21],[6,25],[9,22],[1,30],[14,17]
    ];
    var result = [];
    pairings.forEach(function (p, idx) {
      var tA = qualified[p[0]], tB = qualified[p[1]];
      var parentId = 'ko_r32_' + (idx + 1);
      result.push({
        id: parentId + '_leg1', parentId: parentId, round: 'r32', matchIndex: idx,
        leg: 1, legLabel: 'Allez',
        teamA: tA.id, teamB: tB.id, nameA: tA.name, nameB: tB.name,
        nameArA: tA.nameAr, nameArB: tB.nameAr, flagA: tA.flag, flagB: tB.flag,
        scoreA: null, scoreB: null, status: 'upcoming'
      });
      result.push({
        id: parentId + '_leg2', parentId: parentId, round: 'r32', matchIndex: idx,
        leg: 2, legLabel: 'Retour',
        teamA: tB.id, teamB: tA.id, nameA: tB.name, nameB: tA.name,
        nameArA: tB.nameAr, nameArB: tA.nameAr, flagA: tB.flag, flagB: tA.flag,
        scoreA: null, scoreB: null, status: 'upcoming'
      });
    });
    return result;
  }

  function allFinished(matches) {
    return matches.every(function (m) { return m.status === 'finished'; });
  }

  function advanceWinners(matches, count, nextRoundKey) {
    var ties = {};
    matches.forEach(function (m) {
      var pid = m.parentId || m.id;
      if (!ties[pid]) ties[pid] = [];
      ties[pid].push(m);
    });
    var tieList = Object.keys(ties).sort().map(function (k) { return ties[k]; });
    var next = [];
    for (var i = 0; i < count; i++) {
      var tie1 = tieList[i * 2], tie2 = tieList[i * 2 + 1];
      if (!tie1 || !tie2) break;
      var w1 = getTieWinner(tie1), w2 = getTieWinner(tie2);
      if (!w1 || !w2) break;
      var parentId = 'ko_' + nextRoundKey + '_' + (i + 1);
      next.push({
        id: parentId + '_leg1', parentId: parentId, round: nextRoundKey,
        matchIndex: i, leg: 1, legLabel: 'Allez',
        teamA: w1.id, teamB: w2.id, nameA: w1.name, nameB: w2.name,
        nameArA: w1.nameAr, nameArB: w2.nameAr, flagA: w1.flag, flagB: w2.flag,
        scoreA: null, scoreB: null, status: 'upcoming'
      });
      next.push({
        id: parentId + '_leg2', parentId: parentId, round: nextRoundKey,
        matchIndex: i, leg: 2, legLabel: 'Retour',
        teamA: w2.id, teamB: w1.id, nameA: w2.name, nameB: w1.name,
        nameArA: w2.nameAr, nameArB: w1.nameAr, flagA: w2.flag, flagB: w1.flag,
        scoreA: null, scoreB: null, status: 'upcoming'
      });
    }
    return next;
  }

  var ROUND_ORDER = ['r32', 'r16', 'qf', 'sf', 'final'];
  var ROUND_MATCHES = { r32: 16, r16: 8, qf: 4, sf: 2, final: 1 };

  function getTieLoser(legs) {
    if (!legs || legs.length < 2) return null;
    var leg1 = legs[0], leg2 = legs[1];
    if (leg1.scoreA === null || leg1.scoreB === null || leg2.scoreA === null || leg2.scoreB === null) return null;
    if (leg1.status !== 'finished' || leg2.status !== 'finished') return null;
    var totalA = leg1.scoreA + leg2.scoreB;
    var totalB = leg1.scoreB + leg2.scoreA;
    if (totalA > totalB) return { id: leg1.teamB, name: leg1.nameB, nameAr: leg1.nameArB, flag: leg1.flagB };
    if (totalB > totalA) return { id: leg1.teamA, name: leg1.nameA, nameAr: leg1.nameArA, flag: leg1.flagA };
    return { id: leg1.teamB, name: leg1.nameB, nameAr: leg1.nameArB, flag: leg1.flagB };
  }

  function buildThirdPlaceMatch(sfMatches) {
    var ties = {};
    sfMatches.forEach(function (m) {
      var pid = m.parentId || m.id;
      if (!ties[pid]) ties[pid] = [];
      ties[pid].push(m);
    });
    var tieList = Object.keys(ties).sort().map(function (k) { return ties[k]; });
    if (tieList.length < 2) return [];
    var tie1 = tieList[0], tie2 = tieList[1];
    var l1 = getTieLoser(tie1), l2 = getTieLoser(tie2);
    if (!l1 || !l2) return [];
    return [
      { id: 'ko_third_1_leg1', parentId: 'ko_third_1', round: 'third', matchIndex: 0, leg: 1, legLabel: 'Allez', teamA: l1.id, teamB: l2.id, nameA: l1.name, nameB: l2.name, nameArA: l1.nameAr, nameArB: l2.nameAr, flagA: l1.flag, flagB: l2.flag, scoreA: null, scoreB: null, status: 'upcoming' },
      { id: 'ko_third_1_leg2', parentId: 'ko_third_1', round: 'third', matchIndex: 0, leg: 2, legLabel: 'Retour', teamA: l2.id, teamB: l1.id, nameA: l2.name, nameB: l1.name, nameArA: l2.nameAr, nameArB: l1.nameAr, flagA: l2.flag, flagB: l1.flag, scoreA: null, scoreB: null, status: 'upcoming' }
    ];
  }

  function computeKnockoutProgression() {
    var draw = getDraw();
    if (!draw) return null;

    var matchResults = getMatchResults();
    var allGroupDone = matchResults.length > 0 && matchResults.every(function (m) { return m.status === 'finished'; });
    if (!allGroupDone) return null;

    var standings = computeStandings(draw, matchResults);
    var ko = getKnockoutData() || {};

    if (!ko.r32 || ko.r32.length === 0) {
      ko.r32 = buildRound32(standings, draw);
      saveKnockoutData(ko);
    }

    for (var r = 0; r < ROUND_ORDER.length - 1; r++) {
      var cur = ROUND_ORDER[r], nxt = ROUND_ORDER[r + 1];
      if (ko[cur] && ko[cur].length > 0 && (!ko[nxt] || ko[nxt].length === 0)) {
        if (allFinished(ko[cur])) {
          ko[nxt] = advanceWinners(ko[cur], ROUND_MATCHES[nxt], nxt);
          saveKnockoutData(ko);
        }
      }
    }

    if (ko.sf && ko.sf.length > 0 && allFinished(ko.sf)) {
      if (!ko.third || ko.third.length === 0) {
        ko.third = buildThirdPlaceMatch(ko.sf);
        saveKnockoutData(ko);
      }
    }

    return ko;
  }

  function getKnockoutRound(roundKey) {
    var ko = getKnockoutData();
    return ko && ko[roundKey] ? ko[roundKey] : [];
  }

  function getKnockoutMatchById(matchId) {
    var ko = getKnockoutData();
    if (!ko) return null;
    for (var r = 0; r < ROUND_ORDER.length; r++) {
      var ms = ko[ROUND_ORDER[r]];
      if (!ms) continue;
      for (var i = 0; i < ms.length; i++) {
        if (ms[i].id === matchId) return ms[i];
      }
    }
    return null;
  }

  function updateKnockoutMatchScore(matchId, scoreA, scoreB) {
    var ko = getKnockoutData();
    if (!ko) return false;
    var locked = getLockedMatches();
    for (var r = 0; r < ROUND_ORDER.length; r++) {
      var matches = ko[ROUND_ORDER[r]];
      if (!matches) continue;
      for (var i = 0; i < matches.length; i++) {
        if (matches[i].id === matchId) {
          if (locked.indexOf(matchId) >= 0) return false;
          matches[i].scoreA = scoreA !== undefined ? Number(scoreA) : matches[i].scoreA;
          matches[i].scoreB = scoreB !== undefined ? Number(scoreB) : matches[i].scoreB;
          matches[i].status = (matches[i].scoreA !== null && matches[i].scoreB !== null) ? 'finished' : 'upcoming';
          saveKnockoutData(ko);
          /* Auto-advance winners through bracket */
          var fullKo = getKnockoutData();
          if (fullKo) {
            for (var r2 = 0; r2 < ROUND_ORDER.length - 1; r2++) {
              var cur = ROUND_ORDER[r2], nxt = ROUND_ORDER[r2 + 1];
              if (fullKo[cur] && fullKo[cur].length > 0 && (!fullKo[nxt] || fullKo[nxt].length === 0)) {
                if (allFinished(fullKo[cur])) {
                  fullKo[nxt] = advanceWinners(fullKo[cur], ROUND_MATCHES[nxt], nxt);
                  saveKnockoutData(fullKo);
                }
              }
            }
          }
          return true;
        }
      }
    }
    return false;
  }

  function updateAllKnockoutResults(updates) {
    var ko = getKnockoutData();
    if (!ko) return false;
    var locked = getLockedMatches();
    var changed = false;
    for (var r = 0; r < ROUND_ORDER.length; r++) {
      var matches = ko[ROUND_ORDER[r]];
      if (!matches) continue;
      for (var i = 0; i < matches.length; i++) {
        for (var u = 0; u < updates.length; u++) {
          if (matches[i].id === updates[u].id) {
            if (locked.indexOf(matches[i].id) >= 0) continue;
            matches[i].scoreA = updates[u].scoreA !== '' ? Number(updates[u].scoreA) : null;
            matches[i].scoreB = updates[u].scoreB !== '' ? Number(updates[u].scoreB) : null;
            matches[i].status = (matches[i].scoreA !== null && matches[i].scoreB !== null) ? 'finished' : 'upcoming';
            changed = true;
            break;
          }
        }
      }
    }
    if (changed) {
      saveKnockoutData(ko);
      /* Auto-advance winners through bracket */
      var fullKo = getKnockoutData();
      if (fullKo) {
        for (var r2 = 0; r2 < ROUND_ORDER.length - 1; r2++) {
          var cur = ROUND_ORDER[r2], nxt = ROUND_ORDER[r2 + 1];
          if (fullKo[cur] && fullKo[cur].length > 0 && (!fullKo[nxt] || fullKo[nxt].length === 0)) {
            if (allFinished(fullKo[cur])) {
              fullKo[nxt] = advanceWinners(fullKo[cur], ROUND_MATCHES[nxt], nxt);
              saveKnockoutData(fullKo);
            }
          }
        }
      }
    }
    return changed;
  }

  function resetKnockout() {
    try { localStorage.removeItem(KEYS.KNOCKOUT); return true; }
    catch (e) { return false; }
  }

  function isInitialized() { return getDraw() !== null; }

  return {
    getDraw: getDraw, saveDraw: saveDraw,
    getMatchResults: getMatchResults, saveMatchResults: saveMatchResults,
    initMatchResults: initMatchResults, updateAllMatchResults: updateAllMatchResults,
    setMatchStatus: setMatchStatus,     getQualifiedTeams: getQualifiedTeams, getBestThirdRanking: getBestThirdRanking,
    resetMatchResults: resetMatchResults, getGroupMatches: getGroupMatches,
    getMatchById: getMatchById,
    computeStandings: computeStandings,
    getLockedMatches: getLockedMatches, toggleMatchLock: toggleMatchLock,
    isMatchLocked: isMatchLocked,
    getPlayerMessages: getPlayerMessages, addPlayerMessage: addPlayerMessage,
    clearPlayerMessages: clearPlayerMessages,
    getKnockoutData: getKnockoutData, saveKnockoutData: saveKnockoutData,
    computeKnockoutProgression: computeKnockoutProgression,
    getKnockoutRound: getKnockoutRound,
    getKnockoutMatchById: getKnockoutMatchById,
    updateKnockoutMatchScore: updateKnockoutMatchScore,
    updateAllKnockoutResults: updateAllKnockoutResults,
    resetKnockout: resetKnockout,
    isInitialized: isInitialized
  };
})();
