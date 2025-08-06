import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: "Please fill in all fields" }, { status: 400 })
    }

    console.log("Contact form submission:")
    console.log("Name:", name)
    console.log("Email:", email)
    console.log("Message:", message)

    // Attempt to send email with nodemailer if credentials are available
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          secure: true,
        })

        // Email content
        const mailOptions = {
          from: `"${name}" <${process.env.EMAIL_USER}>`,
          replyTo: email,
          to: "financetracker098@gmail.com",
          subject: `Contact Form: Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        }

        // Send email
        await transporter.sendMail(mailOptions)
        console.log("Email sent successfully")
      } catch (emailError) {
        console.error("Error sending email with nodemailer:", emailError)
        // Continue with the function even if email sending fails
      }
    } else {
      console.log("Email credentials not available. Skipping email sending.")
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ success: false, message: "Failed to send message. Please try again." }, { status: 500 })
  }
}

