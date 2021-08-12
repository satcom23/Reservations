const tablesService = require("./tables.service");
const resService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const validFields = ["table_name", "capacity"];

async function validateData(req, res, next) {
  const { data } = req.body;
  if (!data) {
    next({
      status: 400,
      message: "Data is required",
    });
  }
  res.locals.data = data;
  next();
}

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const table = data.table_name;
  const noCap = data.capacity;
  const dataFields = Object.getOwnPropertyNames(data);
  validFields.forEach((field) => {
    if (!dataFields.includes(field)) {
      return next({
        status: 400,
        message: `The ${field} is missing`,
      });
    }
    if (!table) {
      return next({
        status: 400,
        message: `table_name is empty.`,
      });
    }
    if (table.length < 2) {
      return next({
        status: 400,
        message: `table_name needs to be longer than 1 character.`,
      });
    }
    if (!noCap) {
      return next({
        status: 400,
        message: `capacity needs to be larger than 1.`,
      });
    }
  });
  res.locals.table = data;
  next();
}

async function reservationIdExists(req, res, next) {
  const { reservation_id } = res.locals.data;
  const itExists = await resService.read(reservation_id);
  if (itExists) {
    res.locals.reserve = itExists;
    next();
  } else {
    next({
      status: 404,
      message: `reservation_id ${reservation_id} does not exist!`,
    });
  }
}
async function ifSeated(req, res, next) {
  const {reservation_id} = req.body.data;
  const reservation = await resService.read(reservation_id);
  if(reservation.status === "seated"){
    return next({
      status: 400,
      message: "Ar me matee your arse be seated",
    })
  }
  next();
}

async function missingReservationId(req, res, next) {
  const { data } = res.locals;
  const { reservation_id } = data;

  if (!reservation_id) {
    next({
      status: 400,
      message: `reservation_id Required.`,
    });
  }
  next();
}
async function validateCapacity(req, res, next) {
  const { reserve } = res.locals; 
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);
  const theyDontFit = table.capacity < reserve.people;
  if (theyDontFit) {
    next({
      status: 400,
      message: "Sorry, y'all capacity too fat!",
    });
  }
  res.locals.table = table;
  next();
}
async function ifOccupied(req, res, next) {
  const { table } = res.locals;
  const isOccupied = table?.reservation_id;
  if (isOccupied) {
    next({
      status: 400,
      message: "I'm sorry but this table is occupied for the likes of you",
    });
  } else {
    next();
  }
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    return next({
      status: 404,
      message: `table_id: ${table_id} does not exist`,
    });
  }
}

async function tableIsNotAvailable(req, res, next) {
  const table = res.locals.table;
  if (!table.reservation_id) {
    return next({
      status: 400,
      message: "Table is not occupied/cannot be finished.",
    });
  }
  next();
}

async function create(req, res) {
  const { table } = res.locals;
  const createdTable = await tablesService.create(table);
  res.status(201).json({ data: createdTable });
}

async function update(req, res) {
  const updatedTable = {
    ...res.locals.table,
    ...req.body.data,
  };
  const { reservation_id } = req.body.data;
  await resService.updateStatus(reservation_id, "seated");
  const data = await tablesService.update(updatedTable);
  res.json({ data });
}

async function destroy(req, res, next) {
  await tablesService.destroy(res.locals.table.table_id);
  await resService.updateStatus(res.locals.table.reservation_id, "finished");
  return res.sendStatus(200);
}

async function list(req, res) {
  res.json({ data: await tablesService.list() });
}
module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(hasValidFields), asyncErrorBoundary(create)],
  update: [
    validateData,
    asyncErrorBoundary(missingReservationId),
    asyncErrorBoundary(reservationIdExists),
    asyncErrorBoundary(validateCapacity),
    asyncErrorBoundary(ifOccupied),
    asyncErrorBoundary(ifSeated),
    asyncErrorBoundary(update),
  ],
  destroy: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(tableIsNotAvailable),
    asyncErrorBoundary(destroy),
  ],
  
};
