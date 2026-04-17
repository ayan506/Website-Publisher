import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (username === "admin" && password === "mni@school2024") {
      return res.status(200).json({
        success: true,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  res.status(405).end();
}
