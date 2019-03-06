export const Filters = Object.freeze({
  ALL: "all",
  PARENTAL: "pg",
  PG13: "pg-13",
  GENERAL: "g",
  TRENDING: "trending",
  SCORE: "score",
  STICKER: "sticker",
  SAMEHEIGHT: "SameHeight",
  SAMEWIDTH: "SameWidth",
  ORIGINAL: "Original"
});

export function applyFilter(result, _filter, _limit) {
  let _obj = {};
  Object.assign(_obj, result);
  if (
    _obj != null &&
    _filter != null &&
    _filter !== "all" &&
    _obj.data != null
  ) {
    let _clone;
    if (_filter === Filters.TRENDING) {
      _clone = _obj.data.filter(c => c.trending_datetime !== null);
    } else if (_filter === Filters.SCORE) {
      _clone = _obj.data.sort(function(obj1, obj2) {
        return obj1._score - obj2._score;
      });
    } else if (_filter === Filters.STICKER) {
      _clone = _obj.data.filter(c => c.is_sticker === 1);
    } else {
      _clone = _obj.data.filter(c => c.rating === _filter);
    }
    let _result = {};
    _result.data = _clone.slice(0, _limit);
    return _result;
  }

  if (_obj.data != null) {
    _obj.data = _obj.data.slice(0, _limit);
  }

  return _obj;
}

export function resolveFilter(_filterValue) {
  if (_filterValue === Filters.SAMEHEIGHT) {
    return "fixed_height";
  } else if (_filterValue === Filters.SAMEWIDTH) {
    return "fixed_width";
  } else if (_filterValue === Filters.ORIGINAL) {
    return "original";
  } else {
    return "filters";
  }
}
export function setPlaceHolderResult(result, id, placeholderResult) {
  let t = result.data.find(x => x.id === id);
  if (t === undefined) {
    debugger;
    return placeholderResult.data.find(x => x.id === id);
  }
  return t;
}
