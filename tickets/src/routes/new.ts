import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@limkevin1313_ticket/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { kafkaWrapper } from "../kafka-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      // requireAuth 에서 !req.currentUser) 여부를 검사한다.
      userId: req.currentUser!.id,
    });
    await ticket.save();

    // console.log("ticket.id---", ticket.id);
    const tickets = await Ticket.find({});
    // console.log("티켄써비스 ticket----", tickets)
    // console.log("티켄써비스실행합니다", tickets);
    await new TicketCreatedPublisher(kafkaWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
