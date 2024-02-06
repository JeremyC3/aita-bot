# aita-bot

Finds most controversial post in /r/amitheasshole in the last 24 hours, and posts the contents to a discord channel of your choosing.

## requirements

### discord webhook

Discord's webhook logic can be found [here](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).

### reddit API token

You will need the reddit App ID and secret, which can be generated [here](https://github.com/reddit-archive/reddit/wiki/OAuth2).

## usage

First, fork the directory. Next, create the following [github secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository):

| Name              | Secret                                             |
| ----------------- | -------------------------------------------------- |
| `DISCORD_WEBHOOK` | Webhook URL                                        |
| `UID`             | client ID generated during Reddit oauth generation |
| `SECRET`          | Secret generated during Reddit oauth               |

Additionally, a [variable](https://docs.github.com/en/actions/learn-github-actions/variables#defining-configuration-variables-for-multiple-workflows) can be set with the name of `BOT_IMAGE` and a image URL to set the bot's image URL.
