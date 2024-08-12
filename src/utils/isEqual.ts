function isEqual(a: any, b: any) {
    if (a === b) return true;
  
    if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null) {
      return false;
    }
  
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) return false;
      }
      return true;
    } else if (Array.isArray(a) || Array.isArray(b)) {
      return false;
    }
  
    const keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
  
    for (let key of keysA) {
      if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false;
    }
  
    return true;
  }
  
  export { isEqual };