import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

export const prisma = new PrismaClient();
export const bot_tg = new TelegramBot(process.env.API_KEY_BOT, {
  polling: {
    interval: 200,
    autoStart: true,
  },
});

async function main() {
  bot_tg.on("polling_error", (err) => console.log(err.data.error.message));
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);

  bot_tg.on("message", async (msg) => {
    if (msg.text === "/start") {
      const admins = await prisma.users.findMany({
        where: { role: "admin" },
        select: { tgId: true },
      });

      let isAdmin = false;
      for (let obj of admins) {
        if (String(msg.from.id) === obj.tgId) {
          isAdmin = true;
          await bot_tg.sendMessage(
            msg.chat.id,
            "Функционала для админов не завезли. \n\n\n*_ДЕНЕГ НЕТ_*\n\np.s Во всем виноват паша"
          );
          break;
        }
      }

      if (!isAdmin) {
        try {
          await prisma.users.create({
            data: {
              name: msg.from.last_name
                ? `${msg.from.first_name} ${msg.from.last_name}`
                : msg.from.first_name,
              username: msg.from.username,
              tgId: String(msg.from.id),
              project: process.env.NAME_PROJECT,
            },
          });
          try {
            await bot_tg.forwardMessage(
              process.env.ID_CHAT,
              msg.chat.id,
              msg.message_id
            );
            await bot_tg.sendMessage(
              process.env.ID_CHAT,
              `Username клиента -> ${
                msg.from.username
                  ? "@" + msg.from.username
                  : String(msg.from.id)
              }`
            );
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
        await bot_tg.sendPhoto(msg.chat.id, "./public/main.jpg", {
          caption:
            "*Теперь Авито золотая жила\\.*\n\nАвито приносит клиентов и доход, если все правильно настроить\\.\n\n*Что мешает успеху?*\n→ Не знаете с чего начать\n→ Объявления без просмотров\n→ Нет времени и денег проверять все стратегии\n\n*Чем конкретно поможет консультация?*\n→ Готовая стратегия продвижения для вашей ниши\\.\n→ Готовые текста и конструктор для их составления\\.\n→ Понимание услуг продвижения и какие нужны вам\\.\n→ Узнаете всё о серых методах продвижения\\.\n→ Полностью собранная статистика для вашей ниши\\.\n→ Поймете структуру вывода объявления в топ\\.\n→ Научитесь уникализировать объявления\\.\n→ Получите доступ к программам для работы с контентом\\.\n→ Собранные ключевые запросы для вашей ниши\\.\n\n*Почему это работает?*\n→ Сухие материалы за несколько лет работы\\.\n→ Понятный план без лишних отступлений\\.\n\n*Заметили на какой платформе читаете этот пост?*\n→ Разработаем и установим для вас автоворонку из Авито в Телеграмм\\.\n\n*👉 Консультация сделает так, чтобы Авито работало на вас\\.*",
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "КОНСУЛЬТАЦИЯ",
                  url: "https://t.me/m/dH7-5CwBYmU6",
                },
              ],
              [
                {
                  text: "ЧЕК-ЛИСТ ИДЕАЛЬНОГО ОБЪЯВЛЕНИЯ",
                  callback_data: "chek-list",
                },
              ],
            ],
          },
        });
      }
    }
  });

  bot_tg.on("callback_query", async (query) => {
    if (query.data === "chek-list") {
      await bot_tg.sendDocument(
        query.message.chat.id,
        "./public/Чек-лист идеального объявления.pdf"
      );
      await bot_tg.answerCallbackQuery(query.id);
    }
  });
}

await main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
