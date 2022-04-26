using Microsoft.EntityFrameworkCore;

namespace EventPlanner.Models;

public class PlannerContext : DbContext 
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    
    public DbSet<Event> Events { get; set; } = null!;
    public DbSet<EventType> EventTypes { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Address> Addresses { get; set; } = null!;

    public DbSet<Participant> Participants { get; set; } = null!;
    public DbSet<FavEvent> FavEvents { get; set; } = null!;

    public PlannerContext(DbContextOptions<PlannerContext> options) : base(options)
    {
        Database.EnsureCreated();
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<FavEvent>().HasKey(t => new {
            t.UserId, t.EventId
        });
        
        builder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Participant", Title = "Участник" },
            new Role { Id = 2, Name = "Organizer", Title = "Организатор" });

        builder.Entity<EventType>().HasData(
            new EventType { Id = 1, Name = "Offline", Title = "Офлайн" },
            new EventType { Id = 2, Name = "Online", Title = "Онлайн" });

        builder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Business", Title = "Бизнес" },
            new Category { Id = 2, Name = "IT", Title = "ИТ и интернет" },
            new Category { Id = 3, Name = "Science", Title = "Наука" },
            new Category { Id = 4, Name = "Hobby", Title = "Хобби и творчество" },
            new Category { Id = 5, Name = "Languages", Title = "Иностранные языки" },
            new Category { Id = 6, Name = "Culture", Title = "Искусство и культура" },
            new Category { Id = 7, Name = "Movie", Title = "Кино" },
            new Category { Id = 8, Name = "Sport", Title = "Спорт" },
            new Category { Id = 9, Name = "Exhibition", Title = "Выставки" },
            new Category { Id = 10, Name = "Concert", Title = "Концентры" },
            new Category { Id = 11, Name = "Other", Title = "Другие события" },
            new Category { Id = 12, Name = "OtherEntertaiment", Title = "Другие развлечения" });

        builder.Entity<User>().HasData(
            new User {
                Id = 1,
                FirstName = "Каролина",
                LastName = "Назарова",
                Email = "cardso@rhyta.com",
                Password = "$2a$11$1TjBUPHK6tsKddKdXUp9KeFbC/u6NvYL4mzE6wqroeMvw.n0pgxWu", //eeHee7xugoh
                RegTime = 1648022798,
                AvatarUrl = null,
                RoleId = 2
            },
            new User {
                Id = 2,
                FirstName = "Роберт",
                LastName = "Алиев",
                Email = "feek1993@rhyta.com",
                Password = "$2a$11$.wAt7jt37WlsLhmZH3J9eOijrox.elpjNJ5WXpnzdPYQUjkoiEGWe", // aS9AhN1u
                RegTime = 1648050294,
                AvatarUrl = null,
                RoleId = 2
            },
            new User {
                Id = 3,
                FirstName = "Сергей",
                LastName = "Озёров",
                Email = "hencomitair@armyspy.com",
                Password = "$2a$11$.wAt7jt37WlsLhmZH3J9eOijrox.elpjNJ5WXpnzdPYQUjkoiEGWe", // Yaecha9te1
                RegTime = 1648125670,
                AvatarUrl = null,
                RoleId = 1
            },
            new User {
                Id = 4,
                FirstName = "Всеволод",
                LastName = "Балашов",
                Email = "dered37@armyspy.com",
                Password = "$2a$11$.wAt7jt37WlsLhmZH3J9eOijrox.elpjNJ5WXpnzdPYQUjkoiEGWe", // ceiqu0Lae
                RegTime = 1648150448,
                AvatarUrl = null,
                RoleId = 2
            },
            new User {
                Id = 5,
                FirstName = "Анатолий",
                LastName = "Харламов",
                Email = "hathead@teleworm.us",
                Password = "$2a$11$.wAt7jt37WlsLhmZH3J9eOijrox.elpjNJ5WXpnzdPYQUjkoiEGWe", // seiQuoh7ohp
                RegTime = 1648185723,
                AvatarUrl = null,
                RoleId = 1
            },
            new User {
                Id = 6,
                FirstName = "Алла",
                LastName = "Соломина",
                Email = "Noures96@jourrapide.com",
                Password = "$2a$11$.wAt7jt37WlsLhmZH3J9eOijrox.elpjNJ5WXpnzdPYQUjkoiEGWe", // Oor5fooquuQu
                RegTime = 1648207626,
                AvatarUrl = null,
                RoleId = 1
            }
        );

        builder.Entity<Address>().HasData(
            new Address {
                Id = 1,
                Country = "Россия",
                Region = "Москва",
                City = "Москва",
                Street = "Коммунистическая",
                Building = "8",
                Title = "Бизнес-центр"
            },
            new Address {
                Id = 2,
                Country = "Россия",
                Region = "Москва",
                City = "Москва",
                Street = "1-я Тверская-Ямская",
                Building = "12/23",
                Title = "Конференц-центр"
            }
        );

        builder.Entity<Event>().HasData(
            new Event {
                Id = 1,
                Name = "Мастер-класс «Бесшовная роспись на любых поверхностях»",
                Description = "Каждый день мы удивляемся чудесам, которые открывает перед нами мир. Невидимые границы, в которых мы привыкли видеть себя и окружающий мир, начали разрушаться, и каждый день приносит новое.\n\nВот что вы узнаете на мастерклассе:\nКак научиться рисовать по ткани?\nВ каком случае стоит отсаживать узоры и роспись?\nКак избегать ошибок при выполнении росписи по ткани и какие приемы использовать?",
                CreationTime = 1650446480,
                StartTime = 1650436200,
                EndTime = 1650441600,
                CoverUrl = "/Uploads/1730468617.jpg",
                TypeId = 1,
                CreatorId = 1,
                CategoryId = 4,
                AddressId = 1
            },
            new Event {
                Id = 2,
                Name = "Лекция «Тенденции в предпринимательской деятельности»",
                Description = "На мероприятии вы можете услышать лекцию о современном положении дел в нашем государстве, о проблемах и трудностях, с которыми сталкиваются предприниматели, о новейших тенденциях в законодательстве, а также о том, как вести свою предпринимательскую деятельность, чтобы она приносила пользу людям и была максимально эффективной. Большое внимание мы уделили актуальным вопросам защиты бизнеса, таким как вступление в СРО, отказным делам, а так же защите прав потребителей услуг. Мы хотели бы, чтобы все предприниматели активно участвовали в жизни нашего форума и обсуждали актуальные вопросы на своем месте, в своём городе. Мы приглашаем всех принять участие в этом мероприятии. Заранее большое спасибо всем, кто посетит нашу лекцию.\n\nНаталья Буевич, член Президиума «ОПОРЫ РОССИИ»: «Мы приняли решение сделать федеральный форум бизнесменов в г. Москве ежегодным».\n«Надеемся, что наше активное участие в форуме даст позитивный импульс всем предпринимателям страны. Однако мы не намерены закрывать глаза и на те недостатки законодательства, которые тормозят развитие бизнеса, ведут к увеличению налогообложения и уменьшению реальной отдачи от вложенных в собственное дело средств».\nС текстом выступления Генерального директора юридического бюро «BRACE» А. Б. Судника можно ознакомиться здесь\nДругие материалы по теме в рубрике «Законы и регулирование»\nНовые технологии на страже вашего бизнеса!\nИспользование материалов сайта разрешено только при наличии активной ссылки на источник. Все права на тексты принадлежат их авторам. Права на фото и видео принадлежат ТАСС.",
                CreationTime = 1648249105,
                StartTime = 1649239200,
                EndTime = 0,
                CoverUrl = "/Uploads/1094415932.jpg",
                TypeId = 2,
                CreatorId = 4,
                CategoryId = 1
            },
            new Event {
                Id = 3,
                Name = "Сталин: человек и эпоха",
                Description = "На мероприятии вы можете услышать лекцию «Сталин: человек и эпоха» на примерах биографий лидеров СССР. Это выступления Николая Шляпентоха (1928–2004), Льва Лурье (р. 1924), Игоря Данилевского (р. 1926), Александра Хинштейна (р 1961), историка Аркадия Малера (р 1915), участника Великой Отечественной войны Павла Бабинцева (1904–1971), Владимира Якунина (р 1963), Андрея Ганина (1921–2009) и ряда других историков.\nНашим гостям из Финляндии будет интересно узнать о жизни в годы войны и после её окончания в послевоенной Финляндии. Также узнаем, почему Финляндия осталась нейтральной страной во время Великой Отечественной и как это изменило всю историю финского народа.\nСбор гостей: в 19:00\nТел.: +7 499 252-11-03, +7 916 610-56-59 (экскурсовод)\nE-mail: zvenigorod@inbox.ru",
                CreationTime = 1648364058,
                StartTime = 1650700800,
                EndTime = 1650704400,
                CoverUrl = "/Uploads/2115375749.jpg",
                TypeId = 1,
                CreatorId = 2,
                CategoryId = 11,
                AddressId = 2
            }
        );

        builder.Entity<Participant>().HasData(
            new Participant {
                Id = 1,
                EventId = 3,
                UserId = 3
            },
            new Participant {
                Id = 2,
                EventId = 2,
                UserId = 3
            },
            new Participant {
                Id = 3,
                EventId = 2,
                UserId = 5
            },
            new Participant {
                Id = 4,
                EventId = 1,
                UserId = 5
            },
            new Participant {
                Id = 5,
                EventId = 2,
                UserId = 6
            },
            new Participant {
                Id = 6,
                EventId = 1,
                UserId = 6
            }
        );

        builder.Entity<FavEvent>().HasData(
            new FavEvent {
                UserId = 5,
                EventId = 2
            },
            new FavEvent {
                UserId = 3,
                EventId = 2
            },
            new FavEvent {
                UserId = 3,
                EventId = 3
            }
        );
    }
}