const cats = [
  {
    cat_id: 1,
    name: 'Whiskers',
    birthdate: '2020-01-15',
    weight: 4.5,
    owner: 'Alice',
    originalImage: '/images/100.jpg',
  },
  {
    cat_id: 2,
    name: 'Fluffy',
    birthdate: '2019-06-20',
    weight: 5.0,
    owner: 'Bob',
    originalImage: '/images/200.jpg',
  },
  {
    cat_id: 3,
    name: 'Mittens',
    birthdate: '2021-03-10',
    weight: 3.5,
    owner: 'Charlie',
    originalImage: '/images/300.jpg',
  },
];

export function getAllCats() {
  return cats;
}

export function findCatById(id) {
  return cats.find((cat) => cat.cat_id === id);
}

export function createCat(catData) {
  const newCat = {
    cat_id: Math.max(...cats.map((cat) => cat.cat_id)) + 1,
    ...catData,
  };

  cats.push(newCat);
  return newCat;
}
