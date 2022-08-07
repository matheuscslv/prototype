import express, { Request, Response } from 'express';
import cors from 'cors';

import puppeteer from 'puppeteer'
import path from 'path'
import handlebars from 'handlebars'
import fs from 'fs'

import nodemailer from 'nodemailer';
import { resolve } from 'path';
import { create } from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

import uploadConfig from './config/upload';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/files', express.static(uploadConfig.uploadFolder));

app.get('/email', async (req: Request, res: Response) => {
    try {
        const mailer = nodemailer.createTransport({
            host: 'smtp.umbler.com',
            port: 587,
            secure: false,
            auth: {
                user: 'naoresponda@msbtec.com.br',
                pass: '',
            }
        });

        const viewPath = resolve(__dirname, 'resources', 'views', 'emails');

        mailer.use(
            'compile',
            nodemailerhbs({
                viewEngine: create({
                    defaultLayout: 'src/resources/views/emails/send',
                    extname: '.hbs',
                }),
                viewPath,
                extName: '.hbs',
            })
        )

        mailer.sendMail({
            from: 'Noreply <naoresponda@msbtec.com.br',
            to: `Matheus <math.cs.ceil@gmail.com>`,
            subject: 'Envio de email',
            // @ts-ignore
            template: 'send',
            context: {
                data: new Date().toISOString()
            },
        })

        res.send('Email enviado')
    } catch (error) {
        res.send(error)
    }    
})

app.get('/', async (req: Request, res: Response) => {
    const fileTemplate = path.resolve(
        __dirname,
        'resources',
        'views',
        'reports',
        'report.hbs'
    )

    const templateFileContent = await fs.promises.readFile(fileTemplate, {
        encoding: 'utf-8',
    })

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
    })
    const page = await browser.newPage()
    const parseTemplate = handlebars.compile(templateFileContent)

    const dataContext = {
        titulo: 'Título do Arquivo'
    }

    const html = parseTemplate(dataContext)

    const filename = `${Date.now()}.pdf`

    const tmpFolder = path.resolve(__dirname, '..', 'tmp')

    const reportsFolder = path.resolve(tmpFolder, 'uploads')

    const pathFile = `${reportsFolder}/${filename}`

    await page.setContent(html)
    await page.pdf({
    path: pathFile,
        format: 'a4',
        margin: { bottom: 50, top: 50 },
    })
    await browser.close()

    const url = `http://localhost:3333/files/${filename}`

    res.send({ url })
})

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});