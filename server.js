
import { createServer } from 'http';
import { exec } from 'child_process';
import { URL } from 'url';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';

const server = createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = parsedUrl.pathname;

    // Handle API endpoint for download
    if (pathname === '/download' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { url } = JSON.parse(body);
                if (url) {
                    console.log(`Executing download for: ${url}`);
                    // Execute the download script
                    exec(`node run.js "${url}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Failed to start download.', error: stderr }));
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                        console.error(`stderr: ${stderr}`);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Download finished!', output: stdout }));
                    });
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'URL is required.' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON in request body.' }));
            }
        });
        return; // Important to return after handling the async POST request
    }

    // Serve static files
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const extension = extname(pathname).toLowerCase();
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    }[extension];

    if (contentType) {
        try {
            const content = await readFile(pathname.substring(1), 'utf-8');
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        } catch (error) {
            res.writeHead(404);
            res.end('File not found');
        }
        return;
    }
    
    // Default 404 for any other route
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
