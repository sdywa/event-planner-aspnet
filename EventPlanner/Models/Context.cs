using Microsoft.EntityFrameworkCore;

namespace EventPlanner.Models;

public class Context : DbContext
{
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

    public DbSet<Event> Events { get; set; } = null!;
    public DbSet<EventType> EventTypes { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Address> Addresses { get; set; } = null!;
    public DbSet<Question> Questions { get; set; } = null!;
    public DbSet<Ticket> Tickets { get; set; } = null!;

    public DbSet<Answer> Answers { get; set; } = null!;
    public DbSet<Sale> Sales { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;

    public DbSet<FavEvent> FavEvents { get; set; } = null!;

    public Context(DbContextOptions<Context> options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<EventType>().HasData(
            new EventType{ Id = EventPlanner.EventType.Offline, Name = "Offline", Title = "Офлайн" },
            new EventType{ Id = EventPlanner.EventType.Online, Name = "Online", Title = "Онлайн" }
        );

        builder.Entity<Category>().HasData(
            new Category{ Id = 1, Name = "Business", Title = "Бизнес" },
            new Category{ Id = 2, Name = "IT", Title = "ИТ и интернет" },
            new Category{ Id = 3, Name = "Science", Title = "Наука" },
            new Category{ Id = 4, Name = "Hobby", Title = "Хобби и творчество" },
            new Category{ Id = 5, Name = "Languages", Title = "Иностранные языки" },
            new Category{ Id = 6, Name = "Culture", Title = "Искусство и культура" },
            new Category{ Id = 7, Name = "Movie", Title = "Кино" },
            new Category{ Id = 8, Name = "Sport", Title = "Спорт" },
            new Category{ Id = 9, Name = "Exhibition", Title = "Выставки" },
            new Category{ Id = 10, Name = "Concert", Title = "Концентры" },
            new Category{ Id = 11, Name = "Other", Title = "Другие события" },
            new Category{ Id = 12, Name = "OtherEntertaiment", Title = "Другие развлечения" }
        );

        builder.Entity<Role>().HasData(
            new Role { Id = UserRole.Participant, Name = "Participant", Title = "Участник" },
            new Role { Id = UserRole.Organizer, Name = "Organizer", Title = "Организатор" },
            new Role { Id = UserRole.Administrator, Name = "Administrator", Title = "Администратор" }
        );

        builder.Entity<User>().HasData(
            new User {
                Id = 1,
                Name = "Каролина",
                Surname = "Назарова",
                Email = "cardso@rhyta.com",
                Password = "$2a$11$CSZkDopk8ppLYKci3F3Hku16o5NNMob7bjSXztVpUYqfOjsVhCViu", //eeHee7xugoh
                RegTime = 1648022798,
                RoleId = UserRole.Organizer
            },
            new User {
                Id = 2,
                Name = "Роберт",
                Surname = "Алиев",
                Email = "feek1993@rhyta.com",
                Password = "$2a$11$I.byg3ATg9FPi1nMVrzXXedjwLTPezFZdkJiP0x0FPEs59Fc8qtIi", // aS9AhN1u
                RegTime = 1648050294,
                RoleId = UserRole.Organizer
            },
            new User {
                Id = 3,
                Name = "Сергей",
                Surname = "Озёров",
                Email = "hencomitair@armyspy.com",
                Password = "$2a$11$ikyy6AcYekdAdEmEwN7fFOnojaEY6YhWSE5RS1frvamuoQxHvI9qe", // Yaecha9te1
                RegTime = 1648125670,
                RoleId = UserRole.Participant
            },
            new User {
                Id = 4,
                Name = "Всеволод",
                Surname = "Балашов",
                Email = "dered37@armyspy.com",
                Password = "$2a$11$EtGWjaVugK2aOrh/4r1jPuWJydM5Z/WNz.1wfk3GytOl4fcohqfHK", // ceiqu0Lae
                RegTime = 1648150448,
                RoleId = UserRole.Organizer
            },
            new User {
                Id = 5,
                Name = "Анатолий",
                Surname = "Харламов",
                Email = "hathead@teleworm.us",
                Password = "$2a$11$NRYDDkO88A9vX/BTf0PWGen3p1DiWOkw47/fN7JYBv9lndQxREou2", // seiQuoh7ohp
                RegTime = 1648185723,
                RoleId = UserRole.Participant
            },
            new User {
                Id = 6,
                Name = "Алла",
                Surname = "Соломина",
                Email = "Noures96@jourrapide.com",
                Password = "$2a$11$U6YsXt2Cj5lB9MF/FZ2OSewNBd3lMmmTrv.BWwxZ7MQymUIGcPoZq", // Oor5fooquuQu
                RegTime = 1648207626,
                RoleId = UserRole.Participant
            }
        );

        builder.Entity<Event>().HasData(
            new Event
            {
                Id = 1,
                Title = "Онлайн-семинар по навыкам эффективного общения",
                Description = "Узнайте, как улучшить свои коммуникативные навыки и наладить отношения как в личной, так и в профессиональной среде.",
                FullDescription = @"В современном быстро меняющемся мире навыки эффективного общения важны как никогда. Независимо от того, пытаетесь ли вы установить связь с друзьями и семьей или построить отношения с коллегами и клиентами, способность четко и эффективно общаться имеет важное значение. Вот почему мы рады объявить о нашем предстоящем виртуальном семинаре по навыкам эффективного общения.
На этом семинаре вы узнаете практические советы и приемы по улучшению своих коммуникативных навыков, включая активное слушание, невербальное общение и разрешение конфликтов. Наши опытные фасилитаторы проведут интерактивные дискуссии и увлекательные упражнения, призванные помочь вам развить навыки, необходимые для достижения успеха как в личной, так и в профессиональной жизни.
Не упустите эту возможность инвестировать в себя и научиться общаться более эффективно. Зарегистрируйтесь сейчас и присоединяйтесь к нам [укажите дату и время] на этом увлекательном семинаре!",
                CreationTime = new DateTime(2022, 11, 12, 9, 21, 20),
                StartDate = new DateTime(2023, 01, 18, 16, 0, 0),
                EndDate = new DateTime(2023, 01, 18, 17, 30, 0),
                Cover = "/Uploads/306193353.jpg",
                TypeId = EventPlanner.EventType.Online,
                CreatorId = 1,
                CategoryId = 11
            }
        );

        builder.Entity<Ticket>().HasData(
            new Ticket
            {
                Id = 1,
                EventId = 1,
                Title = "Входной билет",
                Limit = 10,
                Price = 0,
                Until = new DateTime(2023, 01, 12, 0, 0, 0)
            }
        );

        builder.Entity<Question>().HasData(
            new Question
            {
                Id = 1,
                EventId = 1,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 2,
                EventId = 1,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 3,
                EventId = 1,
                Title = "Ваша Фамилия",
                IsEditable = false
            }
        );

        builder.Entity<Sale>().HasData(
            new Sale
            {
                Id = 1,
                TicketId = 1,
                UserId = 4,
                SaleDate = new DateTime(2022, 12, 21, 0, 0, 0)
            },
            new Sale
            {
                Id = 2,
                TicketId = 1,
                UserId = 6,
                SaleDate = new DateTime(2022, 12, 21, 0, 0, 0)
            }
        );

        // builder.Entity<Review>().HasData(
        //     new Review
        //     {
        //         SaleId = 1,

        //     }
        // );

        // builder.Entity<Address>().HasData(
        //     new Address {
        //         Id = 1,
        //         Country = "Россия",
        //         Region = "Москва",
        //         City = "Москва",
        //         Street = "Коммунистическая",
        //         Building = "8",
        //     },
        //     new Address {
        //         Id = 2,
        //         Country = "Россия",
        //         Region = "Москва",
        //         City = "Москва",
        //         Street = "1-я Тверская-Ямская",
        //         Building = "12/23",
        //     }
        // );

        // builder.Entity<Event>().HasData(
        //     new Event
        //     {
        //         Id = 1,
        //         Title = "Мастер-класс «Бесшовная роспись на любых поверхностях»",
        //         Description = "Учимся красиво расписывать ткани",
        //         FullDescription = "Каждый день мы удивляемся чудесам, которые открывает перед нами мир. Невидимые границы, в которых мы привыкли видеть себя и окружающий мир, начали разрушаться, и каждый день приносит новое.\n\nВот что вы узнаете на мастерклассе:\nКак научиться рисовать по ткани?\nВ каком случае стоит отсаживать узоры и роспись?\nКак избегать ошибок при выполнении росписи по ткани и какие приемы использовать?",
        //         CreationTime = new DateTime(2023, 01, 16, 9, 21, 20),
        //         StartDate = new DateTime(2023, 03, 22, 18, 30, 0),
        //         EndDate = new DateTime(2023, 03, 22, 20, 0, 0),
        //         Cover = "/Uploads/1730468617.jpg",
        //         TypeId = EventPlanner.EventType.Offline,
        //         CreatorId = 1,
        //         CategoryId = 4,
        //         AddressId = 1
        //     },
        //     new Event
        //     {
        //         Id = 2,
        //         Title = "Лекция «Тенденции в предпринимательской деятельности»",
        //         Description = "Покажем на пальцах последние направления в предпринимательстве",
        //         FullDescription = "На мероприятии вы можете услышать лекцию о современном положении дел в нашем государстве, о проблемах и трудностях, с которыми сталкиваются предприниматели, о новейших тенденциях в законодательстве, а также о том, как вести свою предпринимательскую деятельность, чтобы она приносила пользу людям и была максимально эффективной. Большое внимание мы уделили актуальным вопросам защиты бизнеса, таким как вступление в СРО, отказным делам, а так же защите прав потребителей услуг. Мы хотели бы, чтобы все предприниматели активно участвовали в жизни нашего форума и обсуждали актуальные вопросы на своем месте, в своём городе. Мы приглашаем всех принять участие в этом мероприятии. Заранее большое спасибо всем, кто посетит нашу лекцию.\n\nНаталья Буевич, член Президиума «ОПОРЫ РОССИИ»: «Мы приняли решение сделать федеральный форум бизнесменов в г. Москве ежегодным».\n«Надеемся, что наше активное участие в форуме даст позитивный импульс всем предпринимателям страны. Однако мы не намерены закрывать глаза и на те недостатки законодательства, которые тормозят развитие бизнеса, ведут к увеличению налогообложения и уменьшению реальной отдачи от вложенных в собственное дело средств».\nС текстом выступления Генерального директора юридического бюро «BRACE» А. Б. Судника можно ознакомиться здесь\nДругие материалы по теме в рубрике «Законы и регулирование»\nНовые технологии на страже вашего бизнеса!\nИспользование материалов сайта разрешено только при наличии активной ссылки на источник. Все права на тексты принадлежат их авторам. Права на фото и видео принадлежат ТАСС.",
        //         CreationTime = new DateTime(2023, 01, 25, 22, 58, 25),
        //         StartDate = new DateTime(2023, 04, 6, 11, 0, 0),
        //         EndDate = null,
        //         Cover = "/Uploads/1094415932.jpg",
        //         TypeId = EventPlanner.EventType.Online,
        //         CreatorId = 4,
        //         CategoryId = 1
        //     },
        //     new Event
        //     {
        //         Id = 3,
        //         Title = "Сталин: человек и эпоха",
        //         Description = "Сталин — достаточно важная фигура в истории СССР, но даже такой человек может обрасти мифами",
        //         FullDescription = "На мероприятии вы можете услышать лекцию «Сталин: человек и эпоха» на примерах биографий лидеров СССР. Это выступления Николая Шляпентоха (1928–2004), Льва Лурье (р. 1924), Игоря Данилевского (р. 1926), Александра Хинштейна (р 1961), историка Аркадия Малера (р 1915), участника Великой Отечественной войны Павла Бабинцева (1904–1971), Владимира Якунина (р 1963), Андрея Ганина (1921–2009) и ряда других историков.\nНашим гостям из Финляндии будет интересно узнать о жизни в годы войны и после её окончания в послевоенной Финляндии. Также узнаем, почему Финляндия осталась нейтральной страной во время Великой Отечественной и как это изменило всю историю финского народа.\nСбор гостей: в 19:00\nТел.: +7 499 252-11-03, +7 916 610-56-59 (экскурсовод)\nE-mail: zvenigorod@inbox.ru",
        //         CreationTime = new DateTime(2023, 02, 2, 9, 54, 18),
        //         StartDate = new DateTime(2023, 03, 23, 13, 0, 0),
        //         EndDate = new DateTime(2023, 03, 23, 14, 0, 0),
        //         Cover = "/Uploads/2115375749.jpg",
        //         TypeId = EventPlanner.EventType.Offline,
        //         CreatorId = 2,
        //         CategoryId = 11,
        //         AddressId = 2
        //     }
        // );
    }
}
