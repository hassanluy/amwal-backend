const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { nonIqFormTemplate } = require('./email-templates/nonIqFormTemplate.js')
const { iqFormTemplate } = require('./email-templates/iqFormTemplate.js')
const { shortForm } = require('./email-templates/shortFormTemplate.js')

const app = express({ extends: true });

app.use(cors());

app.use(express.json());

const port = process.env.PORT || 5000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './temp-images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage });
app.use(express.static(path.join(__dirname, 'client/build')));

const tempImageDir = path.join(__dirname, 'temp-images');

if (!fs.existsSync(tempImageDir)) {
    fs.mkdirSync(tempImageDir);
}


// POST REQUEST
app.post('/api/sendIqEmail', upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
    { name: 'img4', maxCount: 1 },
]), async (req, res) => {
    const {
        firstName,
        fatherName,
        grandfatherName,
        lastName,
        phoneNumber,
        email,
        nationalId,
        nationalIdIssueDate,
        nationalIdIssuePlace,
        placeOfBirth,
        motherFullName,
        birthDate,
        monthlyIncome,
        occupation,
        governorate,
        region,
        neighborhood,
        alley,
        house,
    } = req.body;
    // current date
    let currentDate = new Date();
    let dd = String(currentDate.getDate()).padStart(2, "0");
    let mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    let yyyy = currentDate.getFullYear();
    currentDate = yyyy + "-" + mm + "-" + dd;

    const img1 = req.files.img1[0]
    const img2 = req.files.img2[0]
    const img3 = req.files.img3[0]
    const img4 = req.files.img4[0]

    const img1Name = req.files.img1[0].filename
    const img2Name = req.files.img2[0].filename
    const img3Name = req.files.img3[0].filename
    const img4Name = req.files.img4[0].filename

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: "hasanluy185@gmail.com",
            pass: "xabitbrjnkzxakob",
        },
    });

    const emailContent = iqFormTemplate
        .replace("{{firstName}}", firstName)
        .replace("{{lastName}}", lastName)
        .replace("{{fatherName}}", fatherName)
        .replace("{{grandfatherName}}", grandfatherName)
        .replace("{{phoneNumber}}", phoneNumber)
        .replace("{{email}}", email)
        .replace("{{nationalId}}", nationalId)
        .replace("{{nationalIdIssueDate}}", nationalIdIssueDate)
        .replace("{{nationalIdIssuePlace}}", nationalIdIssuePlace)
        .replace("{{placeOfBirth}}", placeOfBirth)
        .replace("{{motherFullName}}", motherFullName)
        .replace("{{birthDate}}", birthDate)
        .replace("{{monthlyIncome}}", monthlyIncome)
        .replace("{{occupation}}", occupation)
        .replace("{{governorate}}", governorate)
        .replace("{{region}}", region)
        .replace("{{neighborhood}}", neighborhood)
        .replace("{{alley}}", alley)
        .replace("{{house}}", house)
        .replace("{{currentDate}}", currentDate)
    try {
        const info = await transporter.sendMail({
            from: email,
            to: 'amwalps.iq@gmail.com',
            subject: 'amwal order',
            html: emailContent,
            attachments: [
                {
                    filename: img1Name,
                    content: img1,
                    cid: 'img1',
                },
                {
                    filename: img2Name,
                    content: img2,
                    cid: 'img2',
                },
                {
                    filename: img3Name,
                    content: img3,
                    cid: 'img3',
                },
                {
                    filename: img4Name,
                    content: img4,
                    cid: 'img4',
                },
                {
                    filename: 'iqForm.pdf',
                    path: path.join(__dirname, 'imgs', 'iqForm.pdf')
                }
            ],
        });

        if (img1Name && img2Name && img3Name && img4Name) {
            const img1Path = path.join(tempImageDir, img1Name);
            const img2Path = path.join(tempImageDir, img2Name)
            const img3Path = path.join(tempImageDir, img3Name)
            const img4Path = path.join(tempImageDir, img4Name)
            if (fs.existsSync(img1Path) && fs.existsSync(img2Path) && fs.existsSync(img3Path) && fs.existsSync(img4Path)) {
                fs.unlinkSync(img1Path);
                fs.unlinkSync(img2Path);
                fs.unlinkSync(img3Path);
                fs.unlinkSync(img4Path);
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// long form post api 
app.post('/api/sendNonIqEmail', upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
]), async (req, res) => {
    const {
        firstName,
        fatherName,
        grandfatherName,
        lastName,
        phoneNumber,
        email,
        placeOfBirth,
        motherFullName,
        passportNumber,
        passportPlace,
        identityName,
        birthDate,
        monthlyIncome,
        occupation,
        governorate,
        region,
        neighborhood,
        alley,
        house,
    } = req.body;
    const img1 = req.files.img1[0]
    const img2 = req.files.img2[0]
    const img1Name = req.files.img1[0].filename
    const img2Name = req.files.img2[0].filename

    // current date
    let currentDate = new Date();
    let dd = String(currentDate.getDate()).padStart(2, "0");
    let mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    let yyyy = currentDate.getFullYear();
    currentDate = yyyy + "-" + mm + "-" + dd;


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: "hasanluy185@gmail.com",
            pass: "xabitbrjnkzxakob",
        },
    });


    const emailTemplate = nonIqFormTemplate
        .replace("{{firstName}}", firstName)
        .replace("{{lastName}}", lastName)
        .replace("{{fatherName}}", fatherName)
        .replace("{{grandfatherName}}", grandfatherName)
        .replace("{{phoneNumber}}", phoneNumber)
        .replace("{{email}}", email)
        .replace("{{placeOfBirth}}", placeOfBirth)
        .replace("{{motherFullName}}", motherFullName)
        .replace("{{passportNumber}}", passportNumber)
        .replace("{{passportPlace}}", passportPlace)
        .replace("{{identityName}}", identityName)
        .replace("{{birthDate}}", birthDate)
        .replace("{{monthlyIncome}}", monthlyIncome)
        .replace("{{occupation}}", occupation)
        .replace("{{governorate}}", governorate)
        .replace("{{region}}", region)
        .replace("{{neighborhood}}", neighborhood)
        .replace("{{alley}}", alley)
        .replace("{{house}}", house)
        .replace("{{currentDate}}", currentDate)


    try {
        const info = await transporter.sendMail({
            from: email,
            to: 'amwalps.iq@gmail.com',
            subject: 'amwal order',
            html: emailTemplate,
            attachments: [
                {
                    filename: img1Name,
                    content: img1,
                    cid: 'img1',
                },
                {
                    filename: img2Name,
                    content: img2,
                    cid: 'img2',
                },
                {
                    filename: 'nonIqForm.pdf',
                    path: path.join(__dirname, 'imgs', 'nonIqForm.pdf')
                }
            ],
        });

        if (img1Name && img2Name) {
            const img1Path = path.join(tempImageDir, img1Name);
            const img2Path = path.join(tempImageDir, img2Name)
            if (fs.existsSync(img1Path) && fs.existsSync(img2Path)) {
                fs.unlinkSync(img1Path);
                fs.unlinkSync(img2Path);
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// short post api 
app.post('/api/sendShortEmail', upload.none(), (req, res) => {
    // Get the data from the request body
    const { fullName, email, address, phoneNumber } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: "hasanluy185@gmail.com",
            pass: "xabitbrjnkzxakob",
        },
    });
    // date format
    let currentDate = new Date();
    let dd = String(currentDate.getDate()).padStart(2, "0");
    let mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    let yyyy = currentDate.getFullYear();

    currentDate = yyyy + "-" + mm + "-" + dd;

    const emailContent = shortForm
        .replace('{{fullName}}', fullName)
        .replace('{{email}}', email)
        .replace('{{address}}', address)
        .replace('{{currentDate}}', currentDate)
        .replace('{{phoneNumber}}', phoneNumber);

    // Define the email message
    const mailOptions = {
        from: email,
        to: "amwalps.iq@gmail.com", // Recipient's email address
        subject: 'amwal order',
        html: emailContent,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});