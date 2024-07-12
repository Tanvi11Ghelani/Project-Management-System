import { catchAsyncError } from "../middlewares/cathAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Transaction } from "../models/transactionSchema.js";

export const transaction = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler("client is not allowed to update project module!", 400)
    );
  }
  const { module_id, type, description, date, amount } = req.body;

  if (!module_id || !type || !description || !date || !amount) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  const transaction = await Transaction.create({
    module_id,
    type,
    description,
    date,
    amount,
  });

  res.status(201).json({
    success: true,
    transaction,
  });
});

//update transaction

export const updateTransaction = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler("client is not allowed to update project module!", 400)
    );
  }
  const { id } = req.params;

  let transaction = await Transaction.findById(id);

  if (!transaction) {
    return next(new ErrorHandler("Oops! Transaction is not Found", 404));
  }

  transaction = await Transaction.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    transaction,
    message: "transaction updated Successfully!",
  });
});

//get all transaction

export const getAllTransaction = catchAsyncError(async (req, res, next) => {
  const transactions = await Transaction.find();
  if (!transactions) {
    return next(new ErrorHandler("No modules found.", 404));
  }
  res.status(200).json({
    success: true,
    transactions,
  });
});
