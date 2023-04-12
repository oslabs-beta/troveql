class Cache {
  constructor(public persistance: number) {
    this.persistance = persistance;
  }

  /* PRIVATE methods & data*/ //updated to public so that they can be accessed outside of the class
  public cache = new Map<string, { value: string; expireAt: number }>();

  public getPersistance = (): number => {
    if (this.persistance === 0) {
      return Number.MAX_SAFE_INTEGER;
    }
    return this.persistance;
  };
  /* PUBLIC methods & data*/

  //set:
  public set = (key: string, value: string): void => {
    if (key === undefined || value === undefined) return;
    const valPersistance = this.getPersistance();

    let newVal = { value: value, expireAt: valPersistance };
    this.cache.set(key, newVal);
  };

  //get
  public get = (key: string): string | undefined => {
    console.log('>>> this is the key in the get method: ', key);
    if (key === undefined) return undefined;

    if (this.cache.has(key)) {
      console.log('>>> the key has been found!');
      const item = this.cache.get(key);
      return item.value;
    }
    return undefined;
  };

  //delete
  public delete = (key: string): void => {
    this.cache.delete(key);
  };

  //TODO:
  //--create method that iterates through the cache and deletes anything less than the persistance
  //--create method to set the persistance
  //--somehow figure out how to increment through the cache every ? seconds and evict anything that is > than the persistance.
}

export { Cache };
