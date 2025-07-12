class ApiFeatures {
  constructor(queryString) {
    this.queryString = queryString;
    this.whereConditions = [];
    this.sortFields = '';
    this.fields = '*';
    this.page = 1;
    this.limit = 5;
    this.skip = 0;
    this.keyword='';
  }
//search
// search(modelName){
// if(this.queryString.keyword){
//   let query={};
//   if(modelName==='products'){
//     query.
//   }
// }
// }
  // 1️⃣ فلترة WHERE
  filter() {
    const query = { ...this.queryString };
    const excluded = ['page', 'limit', 'sort', 'fields', 'search'];
    excluded.forEach(el => delete query[el]);

    for (const key in query) {
      const value = query[key];

      if (typeof value === 'object' && value !== null) {
        for (const op in value) {
          const sqlOps = {
            gte: '>=',
            gt: '>',
            lte: '<=',
            lt: '<',
            ne: '<>',
            like: 'LIKE'
          };

          const sqlop = sqlOps[op];
          if (!sqlop) continue;

          const val = isNaN(value[op])
            ? (op === 'like' ? `'%${value[op]}%'` : `'${value[op]}'`)
            : value[op];

          this.whereConditions.push(`p.${key} ${sqlop} ${val}`);
        }
      } else {
        const val = isNaN(value) ? `'${value}'` : value;
        this.whereConditions.push(`p.${key} = ${val}`);
      }
    }

    return this;
  }

  // 2️⃣ الترتيب
  sort() {
    const sort = this.queryString.sort;
    if (sort) {
      const fields = sort.split(',').map(f =>
        f.startsWith('-') ? `p.${f.slice(1)} DESC` : `p.${f} ASC`
      );
      this.sortFields = fields.join(', ');
    } else {
      this.sortFields = 'p.id'; // ترتيب افتراضي
    }

    return this;
  }

  // 3️⃣ تحديد الحقول
  limitFields() {
    const fields = this.queryString.fields;
    if (fields) {
      const allowed = fields.split(',').map(f => `p.${f.trim()}`);
      this.fields = allowed.join(',');
    } else {
      this.fields = 'p.*';
    }
    return this;
  }

  // 4️⃣ الترقيم
  paginate() {
    this.page = parseInt(this.queryString.page) || 1;
    this.limit = parseInt(this.queryString.limit) || 5;
    this.skip = (this.page - 1) * this.limit;
    return this;
  }

  // 5️⃣ بناء الجمل النهائية
  build() {
    const whereClause = this.whereConditions.length
      ? `WHERE ${this.whereConditions.join(' AND ')}`
      : '';

    const orderByClause = `ORDER BY ${this.sortFields}`;

    return {
      whereClause,
      orderByClause,
      selectedFields: this.fields,
      skip: this.skip,
      limit: this.limit,
      page: this.page
    };
  }
}

module.exports = ApiFeatures;
 