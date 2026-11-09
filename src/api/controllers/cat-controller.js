import {
  createCat,
  findCatById,
  getAllCats,
  getCatsByUserId,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

export async function getCats(req, res, next) {
  try {
    res.json({
      message: 'Cats retrieved.',
      time: req.requestTime,
      data: await getAllCats(),
    });
  } catch (error) {
    next(error);
  }
}

export async function getCatsByUser(req, res, next) {
  try {
    res.json(await getCatsByUserId(Number(req.params.userId)));
  } catch (error) {
    next(error);
  }
}

export async function addCat(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('A cat image is required.');
      error.status = 400;
      next(error);
      return;
    }

    const newCat = await createCat({
      ...req.body,
      owner: res.locals.user.user_id,
      filename: `/uploads/${req.file.filename}`,
    });

    if (!newCat) {
      return res.status(400).json({ message: 'Cat data is required.' });
    }
    res.redirect(303, `/api/v1/cats/${newCat.cat_id}`);
  } catch (error) {
    next(error);
  }
}

export async function getCatById(req, res, next) {
  try {
    const foundCat = await findCatById(Number(req.params.id));

    if (!foundCat) {
      return res.sendStatus(404);
    }

    res.json(foundCat);
  } catch (error) {
    next(error);
  }
}

export async function updateCat(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates.owner;
    delete updates.user_id;

    if (!(await modifyCat(updates, Number(req.params.id), res.locals.user))) {
      return res.sendStatus(404);
    }
    res.json({ message: 'Cat item updated.' });
  } catch (error) {
    next(error);
  }
}

export async function deleteCat(req, res, next) {
  try {
    if (!(await removeCat(Number(req.params.id), res.locals.user))) {
      return res.sendStatus(404);
    }
    res.json({ message: 'Cat item deleted.' });
  } catch (error) {
    next(error);
  }
}
