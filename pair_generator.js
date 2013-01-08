/**
* Returns a list of candidates
*
* We start with the list and filter out anything that has been
* blacklisted or used or is the actor
* @param  {Array} list       A list of all possible candidates
* @param  {Object} actor     The actor to pick candidates for
* @param  {Hash} blacklist   A hash of which candidates are invalid for the actor
* @param  {Array} used       A list of candidates that have previously been used
* @return {Array}            A list of valid candidates for the actor
*/
var getCandidates = function(list, actor, blacklist, used) {
  var candidates = [];
  for (var i = 0; i < list.length; i++) {
    var potential = list[i];
    if (potential !== actor && (!blacklist[actor] || blacklist[actor].indexOf(potential) === -1) && used.indexOf(potential) === -1) {
      candidates.push(potential);
    }
  }
  return candidates;
};

var generatePairs = function(list, blacklist) {
  return generatePairsRecursive(list, 0, blacklist || [], []);
};

var generatePairsRecursive = function(list, i, blacklist, used) {
  var actor = list[i];
  var candidates = getCandidates(list, actor, blacklist, used);
  if (candidates) {
    for (var j = 0; j < candidates.length; j++) {
      var candidate = candidates[j];
      if (i === list.length - 1) {
        var result = {};
        result[actor] = candidate;
        return result;
      } else {
        var result = generatePairsRecursive(list, i + 1, blacklist, used.concat(candidate));
        if (result.length !== 0) {
          var pair = {};
          pair[actor] = candidate;
          return merge(pair, result);
        }
      }
    }
  }
  return [];
};

var generateAllPairs = function(list, blacklist) {
  return generateAllPairsRecursive(list, 0, blacklist || [], []);
};

var merge = function(obj1, obj2) {
  var newObj = {},
      prop;
  for (prop in obj1) {
    if (obj1.hasOwnProperty(prop)) {
      newObj[prop] = obj1[prop];
    }
  }
  for (prop in obj2) {
    if (obj2.hasOwnProperty(prop)) {
     newObj[prop] = obj2[prop];
    }
  }
  return newObj;
};

var singleFunction = function(actor) {
  return function(candidate) {
    var result = {};
    result[actor] = candidate;
    return result;
  };
};

var mappingFunction = function(actor, candidate) {
  return function(pair) {
    var result = {};
    result[actor] = candidate;
    return merge(result, pair);
  };
};

var generateAllPairsRecursive = function(list, i, blacklist, used) {
  var actor,
      candidates,
      pairs;

  actor = list[i];
  candidates = getCandidates(list, actor, blacklist, used);
  pairs = [];

  if (candidates) {
    if (i === list.length - 1) {
      return candidates.map(singleFunction(actor));
    } else {
      for (var j = 0; j < candidates.length; j++) {
       var candidate = candidates[j];
       var candidatePairs = generateAllPairsRecursive(list, i + 1, blacklist, used.concat(candidate));
       pairs = pairs.concat(candidatePairs.map(mappingFunction(actor, candidate)));
      }
    }
  }
  return pairs;
};
