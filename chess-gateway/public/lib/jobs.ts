import cron from "node-cron"

// import { subDays } from "date-fns"
// import fs from "fs"
// import path from "path"
// import archiver from "archiver"
// import User from "@/models/User"

// export const transporter = nodemailer.createTransport({
//   service: process.env.SMTP_SERVICE || "gmail",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// })

// Every 3 hours
cron.schedule("0,30 * * * *", async () => {
  try {
    // const now = new Date()
    // Delete expired requests older than 3 days

    // Expire pending or endorsed requests older than 3 days

    // Auto complete approved or departed requests
    // Non-business trip: 1 after expected return
    // Business trip: 7 days after expected return
    // const completeRes = await Request.updateMany(
    //   {
    //     $or: [
    //       {
    //         $and: [
    //           { isBusinessTrip: false },
    //           { requestStatus: { $in: ["approved", "departed"] } },
    //           { expectedReturn: { $lt: subDays(now, 1) } },
    //         ],
    //       },
    //       {
    //         $and: [
    //           { isBusinessTrip: true },
    //           { requestStatus: { $in: ["approved", "departed"] } },
    //           { expectedReturn: { $lt: subDays(now, 7) } },
    //         ],
    //       },
    //     ],
    //   },
    //   { $set: { requestStatus: "completed" } }
    // )
    // if (completeRes.modifiedCount > 0)
    //   console.log(
    //     `[CRON] ${completeRes.modifiedCount} approved or departed requests completed successfully on`,
    //     now.toISOString()
    //   )
  } catch (err) {
    console.error("[CRON] Failed to delete expired requests:", err)
  }
})

// Backup data and email every Sunday at midnight
cron.schedule("0 0 * * 0", async () => {
  try {
    // Fetch all data
    // const [users] =
    //   await Promise.all([
    //     User.find(),
    //   ])

    // Create backup directory if not exists
    // const exportDir = path.join(process.cwd(), "backup")
    // fs.mkdirSync(exportDir, { recursive: true })
    // // Create a zip file
    // const zipFilePath = path.join(
    //   exportDir,
    //   `gatepass-backup-${Date.now()}.zip`
    // )
    // // Create a file to stream archive data to.
    // const output = fs.createWriteStream(zipFilePath)
    // const archive = archiver("zip", { zlib: { level: 9 } })

    // // Catch errors
    // archive.on("error", (err: any) => {
    //   throw err
    // })

    // Pipe and append files
    // archive.pipe(output)
    // archive.append(JSON.stringify(branches, null, 2), {
    //   name: "gatepass.branches.json",
    // })
    // archive.append(JSON.stringify(requests, null, 2), {
    //   name: "gatepass.requests.json",
    // })
    // archive.append(JSON.stringify(departments, null, 2), {
    //   name: "gatepass.departments.json",
    // })
    // archive.append(JSON.stringify(vehicles, null, 2), {
    //   name: "gatepass.vehicles.json",
    // })
    // archive.append(JSON.stringify(users, null, 2), {
    //   name: "gatepass.users.json",
    // })
    // await archive.finalize()

    // Backup complete, send email with attachment
    // output.on("close", async () => {
    //   console.log(`[CRON] GP_BACKUP zip created (${archive.pointer()} bytes)`)
    //   try {
    //     const info = await transporter.sendMail({
    //       from: `"Gatepass Backup" <development@c-one.ph>`,
    //       to: "development@c-one.ph",
    //       subject: "🚀 Gatepass Backup File",
    //       text: "Attached is the latest gatepass backup file.",
    //       html: `
    //         <html>
    //           <body>
    //             <h2>Gatepass Backup</h2>
    //             <p>The latest gatepass backup file is attached to this email.</p>
    //             <p>
    //                 <strong>Date:</strong> ${new Date().toLocaleString()}
    //             </p>
    //           </body>
    //         </html>
    //       `,
    //       attachments: [
    //         { filename: path.basename(zipFilePath), path: zipFilePath },
    //       ],
    //     })
    //     console.log(`[CRON] Backup email sent: ${info.messageId}`)
    //   } catch (emailErr) {
    //     console.error("[CRON] Failed to send backup email:", emailErr)
    //   }
    // })

    console.log(
      `[CRON] Gatepass backup created successfully on`,
      new Date().toISOString()
    )
  } catch (err) {
    console.error("[CRON] Failed to create backup:", err)
  }
})

// Delete all requests older than 1 year every Sunday at 1:00 AM
cron.schedule("0 1 * * 0", async () => {
  try {
    // const now = new Date()

  } catch (err) {
    console.error("[CRON] Failed to delete old requests:", err)
  }
})
