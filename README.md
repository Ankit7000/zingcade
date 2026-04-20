# Zingcade

Zingcade is a lightweight static HTML game site. The first version includes a homepage and one playable canvas game: `Dont Stop Ball`.

## Project Structure

```text
zingcade/
├── AGENTS.md
├── README.md
├── .gitignore
├── index.html
├── css/
│   └── styles.css
└── games/
    └── dont-stop-ball/
        └── index.html
```

## How To Test Locally

Because the site uses plain static files, you can test it with a simple local web server.

### Python option

```bash
cd D:\zingcade
python -m http.server 8080
```

Then open `http://localhost:8080/`.

### VS Code Live Server option

If you use VS Code and already have a static server extension, you can also serve the folder from `D:\zingcade`.

## How To Initialize Git

```bash
cd D:\zingcade
git init
git add .
git commit -m "Initial Zingcade site"
```

## Placeholder Steps To Connect GitHub

1. Create a new empty GitHub repository for Zingcade.
2. Copy the repository URL from GitHub.
3. Add the remote locally:

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

## VPS Deployment To `/var/www/zingcade`

This project is static, so deployment can stay simple.
The production VPS should be a clean mirror of `origin/main`, not a place for manual edits.

### First-time clone on the VPS

```bash
cd /var/www
git clone <YOUR_GITHUB_REPO_URL> zingcade
cd /var/www/zingcade
```

### Later updates on the VPS

```bash
cd /var/www/zingcade
git status --short || true
git diff --stat || true
git fetch --prune origin
git reset --hard origin/main
git clean -fd
```

If you need server-local files, keep them outside `/var/www/zingcade` so deploys stay reproducible.

Your web server can then point its document root at `/var/www/zingcade`.
