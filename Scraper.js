const logger = require("ora");
const config = require("./config");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const spinner = {
    interval: 60,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
};

function vote(token) {
    return new Promise(async function (resolve, reject) {
        await puppeteer
            .launch({
                // For Linux or WSL

                //executablePath: "/usr/bin/chromium-browser",
                //args: ["--disable-gpu", "--disable-dev-shm-usage", "--disable-setuid-sandbox", "--no-first-run", "--no-sandbox", "--no-zygote", "--single-process"],

                // For Windows

                executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",

                headless: false, // Open chrome or not(true means that is off), recommended to be false
                slowMo: 10
            })
            .then(async (browser) => {
                console.log(`[RUNNING AS]: ${token}`);

                const page = await browser.newPage();

                await page.setViewport({
                    width: 1920,
                    height: 1080,
                    deviceScaleFactor: 1
                });

                const connectLog = logger({
                    text: "[CONNECTING TO DISCORD]",
                    spinner
                }).start();

                await page.goto("https://discord.com/oauth2/authorize?client_id=745828915993640980&redirect_uri=https%3A%2F%2Fzuraaa.com%2Foauth2%2Fcallback&response_type=code&scope=identify", {
                    waitUntil: "networkidle0"
                });

                connectLog.succeed("[CONNECTED TO DISCORD]");

                const discordLog = logger({
                    text: "[LOGGING INTO DISCORD]",
                    spinner
                }).start();

                await page.evaluate((_) => {
                    function login(_token) {
                        document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token = `"${_token}"`;
                        setTimeout(() => {
                            location.reload();
                        }, 200);
                    }

                    login(_);
                }, token);

                const logged = await page.waitForNavigation({ waitUntil: "networkidle0" }).catch((e) => null);

                if (page.url() === "https://discord.com/login" || !logged) return resolve(discordLog.fail("[COULDN'T CONNECT TO DISCORD]"));

                discordLog.succeed("[LOGGING INTO DISCORD]");

                const oauth2Log = logger({
                    text: "[LOGGING INTO OAUTH2]",
                    spinner
                }).start();

                await page.waitForNavigation({ waitUntil: "networkidle0" });

                await page.evaluate((_) => {
                    Array.from(document.querySelectorAll("div"))
                        .filter((e) => e.innerText == "Authorize")[0]
                        .parentElement.click();
                });

                await page.waitForNavigation({ waitUntil: "networkidle0" });

                await page.waitForSelector(".bots");

                oauth2Log.succeed("[LOGGED INTO OAUTH2]");

                await page.goto(`https://zuraaa.com/bots/${config.botID}/votar`, { waitUntil: "networkidle0" });

                const voteLog = logger({
                    text: "[VOTING]",
                    spinner
                }).start();

                const btn = await page.evaluate((_) => {
                    if (document.querySelector(".g-recaptcha.button")) {
                        document.querySelector(".g-recaptcha.button").click();
                        return true;
                    } else return false;
                });

                if (!btn) return resolve(voteLog.fail("[BLOCKED TOKEN]"));

                await page.waitFor(3000);

                const text = await page.evaluate((_) => {
                    return document.querySelector(".title.is-size-3.is-uppercase").innerText;
                });

                if (text != "Erro") {
                    voteLog.succeed(`[VOTED TO ${config.botID}]`);
                } else if (!text) return resolve(voteLog.fail(`[BLOCKED TOKEN]`));
                else {
                    voteLog.fail(`[ALREADY VOTED TO ${config.botID}]`);
                }

                await page.screenshot({ path: `./prints/${token}.png` });

                await browser.close();

                console.log("--------------------------------------");

                resolve(true);
            });
    });
}

module.exports = vote;
