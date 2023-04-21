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
            new EventType { Id = EventPlanner.EventType.Offline, Name = "Offline", Title = "Офлайн" },
            new EventType { Id = EventPlanner.EventType.Online, Name = "Online", Title = "Онлайн" }
        );

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
            new Category { Id = 10, Name = "Concert", Title = "Концерты" },
            new Category { Id = 11, Name = "Other", Title = "Другие события" },
            new Category { Id = 12, Name = "OtherEntertaiment", Title = "Другие развлечения" }
        );

        builder.Entity<Role>().HasData(
            new Role { Id = UserRole.Participant, Name = "Participant", Title = "Участник" },
            new Role { Id = UserRole.Organizer, Name = "Organizer", Title = "Организатор" },
            new Role { Id = UserRole.Administrator, Name = "Administrator", Title = "Администратор" }
        );

        builder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Каролина",
                Surname = "Назарова",
                Email = "cardso@rhyta.com",
                Password = "$2a$11$CSZkDopk8ppLYKci3F3Hku16o5NNMob7bjSXztVpUYqfOjsVhCViu", //eeHee7xugoh
                RegTime = DateTime.Now.AddDays(-120),
                RoleId = UserRole.Organizer
            },
            new User
            {
                Id = 2,
                Name = "Роберт",
                Surname = "Алиев",
                Email = "feek1993@rhyta.com",
                Password = "$2a$11$I.byg3ATg9FPi1nMVrzXXedjwLTPezFZdkJiP0x0FPEs59Fc8qtIi", // aS9AhN1u
                RegTime = DateTime.Now.AddDays(-120),
                RoleId = UserRole.Organizer
            },
            new User
            {
                Id = 3,
                Name = "Сергей",
                Surname = "Озёров",
                Email = "hencomitair@armyspy.com",
                Password = "$2a$11$ikyy6AcYekdAdEmEwN7fFOnojaEY6YhWSE5RS1frvamuoQxHvI9qe", // Yaecha9te1
                RegTime = DateTime.Now.AddDays(-120),
                RoleId = UserRole.Participant
            },
            new User
            {
                Id = 4,
                Name = "Всеволод",
                Surname = "Балашов",
                Email = "dered37@armyspy.com",
                Password = "$2a$11$EtGWjaVugK2aOrh/4r1jPuWJydM5Z/WNz.1wfk3GytOl4fcohqfHK", // ceiqu0Lae
                RegTime = DateTime.Now.AddDays(-120),
                RoleId = UserRole.Organizer
            },
            new User
            {
                Id = 5,
                Name = "Анатолий",
                Surname = "Харламов",
                Email = "hathead@teleworm.us",
                Password = "$2a$11$NRYDDkO88A9vX/BTf0PWGen3p1DiWOkw47/fN7JYBv9lndQxREou2", // seiQuoh7ohp
                RegTime = DateTime.Now.AddDays(-120),
                RoleId = UserRole.Participant
            },
            new User
            {
                Id = 6,
                Name = "Алла",
                Surname = "Соломина",
                Email = "Noures96@jourrapide.com",
                Password = "$2a$11$U6YsXt2Cj5lB9MF/FZ2OSewNBd3lMmmTrv.BWwxZ7MQymUIGcPoZq", // Oor5fooquuQu
                RegTime = DateTime.Now.AddDays(-120),
                RoleId = UserRole.Participant
            },
            new User
            {
                Id = 7,
                Name = "Савва",
                Surname = "Грибков",
                Email = "savva1969@rambler.ru",
                Password = "$2a$11$pM8toFrDeeO2m2iYxEi3mO0ajvZ8E29x.034KKILnaXOa747FpaBq", // 9263bbc28
                RegTime = DateTime.Now.AddDays(-120),
                RoleId = UserRole.Organizer
            },
            new User
            {
                Id = 8,
                Name = "Людмила",
                Surname = "Дасаева",
                Email = "lyudmila4797@mail.ru",
                Password = "$2a$11$nuBg7nEFAgmJ.WAwZdhj6.hRppS5tDgtLbEOKgmMpxh212GNhiEmO", // d4e1bd628
                RegTime = DateTime.Now.AddDays(-120),
                RoleId = UserRole.Organizer
            }
        );

        builder.Entity<Address>().HasData(
            new Address
            {
                Id = 1,
                Country = "Россия",
                Region = "Нижегородская область",
                City = "Подольск",
                Street = "въезд Космонавтов",
                Building = "27",
            },
            new Address
            {
                Id = 2,
                Country = "Россия",
                Region = "Московская область",
                City = "Клин",
                Street = "пл. Домодедовская",
                Building = "52",
            },
            new Address
            {
                Id = 3,
                Country = "Россия",
                Region = "Тюменская область",
                City = "Егорьевск",
                Street = "спуск Гоголя",
                Building = "70",
            },
            new Address
            {
                Id = 4,
                Country = "Россия",
                Region = "Омская область",
                City = "Дорохово",
                Street = "проезд Космонавтов",
                Building = "55",
            },
            new Address
            {
                Id = 5,
                Country = "Россия",
                Region = "Москва",
                City = "Москва",
                Street = "1-я Тверская-Ямская",
                Building = "12/23",
            },
            new Address
            {
                Id = 6,
                Country = "Россия",
                Region = "Москва",
                City = "Москва",
                Street = "Коммунистическая",
                Building = "8",
            },
            new Address
            {
                Id = 7,
                Country = "Россия",
                Region = "Рязанская область",
                City = "Павловский Посад",
                Street = "Ленина",
                Building = "16",
            },
            new Address
            {
                Id = 8,
                Country = "Россия",
                Region = "Амурская область",
                City = "Зарайск",
                Street = "Будапештсткая",
                Building = "48",
            },
            new Address
            {
                Id = 9,
                Country = "Россия",
                Region = "Москва",
                City = "Москва",
                Street = "2-ая Останкинская улица",
                Building = "3",
            }
        );

        builder.Entity<Event>().HasData(
            new Event
            {
                Id = 1,
                Title = "Онлайн-семинар по навыкам эффективного общения",
                Description = "Узнайте, как улучшить свои коммуникативные навыки и наладить отношения как в личной, так и в профессиональной среде.",
                FullDescription = @"В современном быстро меняющемся мире навыки эффективного общения важны как никогда. Независимо от того, пытаетесь ли вы установить связь с друзьями и семьей или построить отношения с коллегами и клиентами, способность четко и эффективно общаться имеет важное значение. Вот почему мы рады объявить о нашем предстоящем онлайн-семинаре по навыкам эффективного общения.
На этом семинаре вы узнаете практические советы и приемы по улучшению своих коммуникативных навыков, включая активное слушание, невербальное общение и разрешение конфликтов. Наши опытные фасилитаторы проведут интерактивные дискуссии и увлекательные упражнения, призванные помочь вам развить навыки, необходимые для достижения успеха как в личной, так и в профессиональной жизни.
Не упустите эту возможность инвестировать в себя и научиться общаться более эффективно. Зарегистрируйтесь сейчас и присоединяйтесь к нам [укажите дату и время] на этом увлекательном семинаре!",
                CreationTime = new DateTime(2022, 11, 12, 9, 21, 20),
                StartDate = new DateTime(2023, 01, 18, 16, 0, 0),
                EndDate = new DateTime(2023, 01, 18, 17, 30, 0),
                Cover = "/Uploads/306193353.jpg",
                TypeId = EventPlanner.EventType.Online,
                CreatorId = 1,
                CategoryId = 11
            },
            new Event
            {
                Id = 2,
                Title = "Нетворкинг-завтрак: Объединение профессионалов и построение отношений",
                Description = "Присоединяйтесь к нам для утра сетевого взаимодействия и построения отношений с специалистами-единомышленниками в вашей отрасли.",
                FullDescription = @"Вы хотите расширить свою профессиональную сеть и связаться с другими единомышленниками в вашей отрасли? Если это так, мы приглашаем вас присоединиться к нам для нашего делового завтрака: объединение профессионалов и построение отношений.
Это событие предназначено для того, чтобы предоставить профессионалам платформу для встречи и обмена идеями, пониманием и лучшими практиками. Независимо от того, являетесь ли вы предпринимателем, владельцем бизнеса или работающим специалистом, это событие - отличная возможность расширить вашу сеть и построить значимые отношения с другими в вашей области.
На нашем завтраке будет представлен основной докладчик, который поделится своим опытом и пониманием последних тенденций и проблем в отрасли. У вас также будет достаточно времени, чтобы общаться с другими участниками, поделиться своим опытом и учиться у других.
Не упустите эту возможность расширить свою сеть, построить отношения и быть в курсе последних событий в вашей отрасли. Присоединяйтесь к нам для этого захватывающего завтрака для бизнес-сети и поднимите свою карьеру на следующий уровень.",
                CreationTime = new DateTime(2022, 11, 12, 9, 21, 20),
                StartDate = new DateTime(2023, 01, 18, 16, 0, 0),
                EndDate = new DateTime(2023, 01, 18, 17, 30, 0),
                Cover = "/Uploads/929754075.jpg",
                TypeId = EventPlanner.EventType.Offline,
                CreatorId = 2,
                CategoryId = 1,
                AddressId = 1
            },
            new Event
            {
                Id = 3,
                Title = "Конференция «Перспективы экономики»",
                Description = "Присоединяйтесь к нам для углубленного анализа экономического ландшафта и стратегий для навигации по пост-пандемическому миру.",
                FullDescription = @"Вам интересно с экономическими перспективами пост-пандемического мира? Вы хотите узнать о последних тенденциях, проблемах и возможностях в мировой экономике? Если это так, мы приглашаем вас присоединиться к нам на нашей конференции по экономическим взглядам: понимание и стратегии для пост-пандемического мира.
Эта конференция предназначена для того, чтобы предоставить участникам всесторонний анализ текущего экономического ландшафта и понимания того, как ориентироваться в проблемах и возможностях, которые находятся впереди. Наши экспертные докладчики поделится своим опытом по таким темам, как глобальные экономические тенденции, влияние пандемии на различные отрасли и стратегии управления рисками и неопределенностью.
В дополнение к основным выступлениям, будут проводиться интерактивные панельные дискуссии и прорывные сессии, которые дают вам возможность задавать вопросы, обмениваться идеями и учиться у других посетителей.
Независимо от того, являетесь ли вы экономистом, владельцем бизнеса или работающим профессионалом, эта конференция является обязательным событием для тех, кто интересуется экономическими перспективами для пост-пандемического мира.
Не упустите эту возможность получить информацию, стратегии и перспективы от ведущих экспертов в этой области. Присоединяйтесь к нам для этой информативной и увлекательной конференции по экономическим перспективам.",
                CreationTime = new DateTime(2022, 11, 12, 9, 21, 20),
                StartDate = new DateTime(2023, 01, 18, 16, 0, 0),
                EndDate = new DateTime(2023, 01, 18, 17, 30, 0),
                Cover = "/Uploads/381576462.jpg",
                TypeId = EventPlanner.EventType.Online,
                CreatorId = 4,
                CategoryId = 1,
                AddressId = 2
            },
            new Event
            {
                Id = 4,
                Title = "Ежегодный спортивный фестиваль",
                Description = "Присоединяйтесь к нам на день веселья, игр и дружеских соревнований на нашем ежегодном спортивном фестивале.",
                FullDescription = @"Вы ищете веселый и привлекательный способ общения со своим сообществом и оставаться активным? Если это так, мы приглашаем вас присоединиться к нам на нашем ежегодном спортивном фестивале: празднование сообщества и соревнования.
Этот фестиваль предназначен для того, чтобы объединить людей всех возрастов и способностей для дня спорта, игр и дружеских соревнований. Являетесь ли вы опытным спортсменом или новичком, на этом мероприятии есть что -то для всех.
В нашем фестивале будут представлены различные виды спорта и игры, в том числе баскетбол, волейбол, футбол и многое другое. Также будут веселые занятия для детей, продавцов еды и живой музыки, чтобы сохранить энергию и волнение в течение дня.
Это отличная возможность общаться с другими в вашем сообществе, завести новых друзей и веселиться, оставаясь активным и здоровым. Так что принесите свою семью и друзей и присоединяйтесь к нам на этот захватывающий день общины и конкуренции.",
                CreationTime = new DateTime(2022, 11, 12, 9, 21, 20),
                StartDate = new DateTime(2023, 01, 18, 16, 0, 0),
                EndDate = new DateTime(2023, 01, 18, 17, 30, 0),
                Cover = "/Uploads/442941688.jpg",
                TypeId = EventPlanner.EventType.Offline,
                CreatorId = 7,
                CategoryId = 8,
                AddressId = 3
            },
            new Event
            {
                Id = 5,
                Title = "Будущее сферы труда: экономические последствия и возможности",
                Description = "Присоединяйтесь к нам, чтобы прочитать содержательную лекцию о будущем труда, его экономических последствиях и возможностях.",
                FullDescription = @"Вам интересно, как будущее работы повлияет на экономику и какие возможности и проблемы ждут впереди? Если да, то мы приглашаем вас присоединиться к нашей предстоящей лекции на тему «Будущее работы: экономические последствия и возможности».
Наш эксперт-спикер поделится своим мнением о последних тенденциях и изменениях в рабочей силе и о том, как они будут формировать экономику. Эта лекция представит всесторонний обзор будущего работы и ее экономического влияния, от роста автоматизации и работы на выгул до изменения демографических показателей и требований к навыкам.
В дополнение к лекции у участников будет возможность задать вопросы и обменяться идеями, что сделает это мероприятие отличным сетевым мероприятием как для профессионалов, так и для ученых.
Эта лекция является обязательным событием для всех, кто интересуется будущим работы и ее экономическими последствиями. Не упустите эту возможность, чтобы получить ценную информацию и точки зрения по этой важной теме.",
                CreationTime = new DateTime(2023, 01, 16, 9, 21, 20).AddMonths(3),
                StartDate = new DateTime(2023, 03, 22, 18, 30, 0).AddMonths(3),
                EndDate = new DateTime(2023, 03, 22, 20, 0, 0).AddMonths(3),
                Cover = "/Uploads/504548584.jpg",
                TypeId = EventPlanner.EventType.Offline,
                CreatorId = 1,
                CategoryId = 1,
                AddressId = 4
            },
            new Event
            {
                Id = 6,
                Title = "Открывая заново богатую историю России",
                Description = "Присоединяйтесь к нам в увлекательном путешествии по истории, культуре и традициям России.",
                FullDescription = @"Вы очарованы богатой историей, культурой и традициями России? Хотите узнать больше об этой интересной стране и ее жителях? Если да, то мы приглашаем вас присоединиться к нам на культурном и научном вечере, когда мы заново открываем для себя богатую историю России.
Наш опытный спикер проведет вас по прошлому России, от восхождения царей до падения Советского Союза и далее. По пути вы откроете для себя богатое культурное наследие страны, в том числе ее литературу, музыку, искусство и архитектуру.
В дополнение к лекции будут живые выступления русской музыки и танцев, а также возможность отведать традиционные русские блюда и напитки. У вас также будет возможность встретиться и пообщаться с другими участниками, разделяющими вашу страсть к русской истории и культуре.
Это событие обязательно для посещения всем, кто интересуется богатой историей, культурой и традициями России. Не упустите эту возможность углубить свое понимание этой очаровательной страны и ее жителей.",
                CreationTime = new DateTime(2023, 01, 25, 22, 58, 25).AddMonths(3),
                StartDate = new DateTime(2023, 04, 6, 11, 0, 0).AddMonths(3),
                EndDate = null,
                Cover = "/Uploads/537816854.jpg",
                TypeId = EventPlanner.EventType.Offline,
                CreatorId = 2,
                CategoryId = 11,
                AddressId = 5
            },
            new Event
            {
                Id = 7,
                Title = "Овладение искусством французской выпечки: практический мастер-класс",
                Description = "Приходите к нам на практический мастер-класс по искусству французской выпечки под руководством известного шеф-кондитера.",
                FullDescription = @"Вы любите французскую выпечку, от круассанов до макарон, и хотите научиться делать их сами? Если да, то мы приглашаем вас присоединиться к нам на практический мастер-класс по искусству французской выпечки.
Этот мастер-класс под руководством известного кондитера научит вас методам и навыкам, необходимым для создания разнообразных классических французских кондитерских изделий. Вы научитесь делать слоеное тесто, создавать нежные меренги и овладеете искусством кондитерского крема, получая при этом практический опыт в небольшой группе.
Помимо практических занятий, у вас будет возможность попробовать приготовленную вами выпечку, а также задать вопросы и обменяться идеями с кондитером и другими участниками.
Этот мастер-класс обязателен к посещению всем, кто любит французскую выпечку и хочет научиться делать ее дома. Независимо от того, являетесь ли вы новичком или опытным пекарем, вы уйдете с навыками и уверенностью, чтобы приготовить вкусную французскую выпечку на собственной кухне.",
                CreationTime = new DateTime(2023, 02, 2, 9, 54, 18).AddMonths(3),
                StartDate = new DateTime(2023, 03, 23, 13, 0, 0).AddMonths(3),
                EndDate = new DateTime(2023, 03, 23, 14, 0, 0).AddMonths(3),
                Cover = "/Uploads/564237405.jpg",
                TypeId = EventPlanner.EventType.Offline,
                CreatorId = 4,
                CategoryId = 4,
                AddressId = 6
            },
            new Event
            {
                Id = 8,
                Title = "Передовые методы программирования: изучение новейших инструментов",
                Description = "Присоединяйтесь к нам для углубленного изучения новейших инструментов и технологий программирования под руководством опытных программистов.",
                FullDescription = @"Вы программист и хотите поднять свои навыки на новый уровень? Хотите быть в курсе новейших инструментов и технологий программирования? Если да, мы приглашаем вас присоединиться к нам для углубленного изучения передовых методов программирования.
Это мероприятие под руководством опытных программистов позволит глубже погрузиться в новейшие инструменты и технологии, используемые в программировании. Вы узнаете о передовых языках программирования, фреймворках и библиотеках, а также о передовых методах отладки, тестирования и оптимизации кода.
В дополнение к презентациям будет возможность принять участие в практических семинарах и пообщаться с другими программистами и экспертами в этой области.
Это мероприятие является обязательным для всех, кто заинтересован в развитии своих навыков программирования и в курсе последних тенденций в отрасли. Являетесь ли вы опытным программистом или только начинаете, вы получите ценные идеи и практические знания, которые сможете применить в своих собственных проектах.",
                CreationTime = new DateTime(2023, 01, 16, 9, 21, 20).AddMonths(3),
                StartDate = new DateTime(2023, 03, 22, 18, 30, 0).AddMonths(3),
                EndDate = new DateTime(2023, 03, 22, 20, 0, 0).AddMonths(3),
                Cover = "/Uploads/933632227.jpg",
                TypeId = EventPlanner.EventType.Online,
                CreatorId = 2,
                CategoryId = 2
            },
            new Event
            {
                Id = 9,
                Title = "Искусство природы: фотографическая выставка мира природы",
                Description = "Приходите на выставку потрясающих фотографии природы, демонстрируя красоту и разнообразие мира природы.",
                FullDescription = @"Вы любитель природы, который ценит красоту и сложность мира природы? Если это так, мы приглашаем вас присоединиться к нам на выставку потрясающей фотографии природы, демонстрируя чудеса нашей планеты.
Эта выставка, в которой представлены работы отмеченных наградами фотографов природы со всего мира, дает представление о необычайном разнообразии и сложности мира природы. От величественных пейзажей до интимных портретов дикой природы эти фотографии отражают суть красоты нашей планеты и вдохновляют чувство страха и удивления.
В дополнение к самой выставке будет возможность узнать больше об искусстве и науке о природе фотографий с помощью переговоров и семинаров со стороны известных фотографов. У посетителей также будет возможность приобрести отпечатки и другие товары с потрясающими изображениями на выставке.
Эта выставка является обязательным для тех, кто любит природу и хочет испытать свою красоту через призму талантливых фотографов. Являетесь ли вы фотографом - любителем, энтузиастом природы или просто ищете вдохновение, эта выставка не должна быть пропущена.",
                CreationTime = new DateTime(2023, 01, 25, 22, 58, 25).AddMonths(3),
                StartDate = new DateTime(2023, 04, 6, 11, 0, 0).AddMonths(3),
                EndDate = null,
                Cover = "/Uploads/966856927.jpg",
                TypeId = EventPlanner.EventType.Offline,
                CreatorId = 7,
                CategoryId = 9,
                AddressId = 7
            },
            new Event
            {
                Id = 10,
                Title = "Открывая скрытые жемчужины нашего города",
                Description = "Присоединяйтесь к нам в пешеходной экскурсии с гидом, чтобы открыть для себя скрытые жемчужины и секретные места нашего города.",
                FullDescription = @"Вы когда-нибудь хотели открыть для себя скрытые жемчужины и секретные места вашего собственного города? Если это так, мы приглашаем вас присоединиться к нам в пешеходной экскурсии с гидом, которая уведет вас в сторону от проторенных троп и откроет для вас малоизвестные сокровища нашего города.
Эта экскурсия под руководством знающего и страстного гида проведет вас по скрытым улицам и переулкам города, а также по его менее известным паркам и достопримечательностям. Вы откроете для себя скрытые художественные инсталляции, секретные сады и менее известные исторические места, узнавая о богатой истории и культурном наследии города.
В дополнение к экскурсии у вас будет возможность остановиться в местных кафе и магазинах и пообщаться с местными жителями, которые называют этот город своим домом. У вас также будет возможность встретиться с другими исследователями-единомышленниками и открыть для себя новый взгляд на город, который, как вы думали, вы знали.
Эта экскурсия обязательна к посещению для всех, кто любит исследовать и хочет открыть для себя скрытые жемчужины своего города. Независимо от того, являетесь ли вы местным жителем или приезжим, эта пешеходная экскурсия с гидом покажет вам сторону города, которую вы никогда раньше не видели.",
                CreationTime = new DateTime(2023, 02, 2, 9, 54, 18).AddMonths(3),
                StartDate = new DateTime(2023, 03, 23, 13, 0, 0).AddMonths(3),
                EndDate = new DateTime(2023, 03, 23, 14, 0, 0).AddMonths(3),
                Cover = "/Uploads/1008661425.jpg",
                TypeId = EventPlanner.EventType.Offline,
                CreatorId = 8,
                CategoryId = 11,
                AddressId = 8
            },
            new Event
            {
                Id = 11,
                Title = "Открытие большого колеса",
                Description = "Торжественное открытие самого новейшего колесного колеса нашего города",
                FullDescription = @"Ожидание закончилось! Новейшая достопримечательность нашего города, возвышающееся колесо обозрения, наконец-то готова к его торжественному открытию. Это захватывающее новое дополнение к городскому горизонту предлагает захватывающий дух вид на окрестности, и, несомненно, станет местом посещения как для местных жителей, так и для посетителей.
Благодаря его впечатляющему размеру и современному дизайну, колесо обозрения является настоящим инженерным чудом. Он предлагает удобные, кондиционированные гондолы, которые могут вместить до шести пассажиров, и гладкую, нежную поездку, которая подходит для всех возрастов. С вершины колеса гонщики смогут увидеть город с совершенно новой точки зрения, с потрясающим видом на горизонт, реку и окружающую сельскую местность.
Чтобы отпраздновать торжественное открытие этой захватывающей новой достопримечательности, мы проводим специальное мероприятие, которое будет включать музыку, еду и веселье для всей семьи. Там будут раскраска лица и скручивание воздушного шара для детей, живую музыку и развлечения, а также широкий спектр вариантов еды и напитков для удовлетворения любого аппетита. И, конечно же, главной достопримечательностью будет само колесо обозрения, которое будет открыто для поездок в течение дня и в ночь.
Независимо от того, ищете ли вы острые ощущения, ищете прилив адреналина или просто ищете уникальный способ увидеть город, большое колесо нельзя пропустить. Так что присоединяйтесь к нам на день веселья, волнения и приключений на торжественном открытии новой достопримечательности нашего города.",
                CreationTime = new DateTime(2023, 03, 2, 9, 54, 18).AddMonths(3),
                StartDate = new DateTime(2023, 05, 15, 16, 0, 0).AddMonths(3),
                EndDate = new DateTime(2023, 05, 15, 17, 0, 0).AddMonths(3),
                Cover = "/Uploads/1225857044.jpg",
                TypeId = EventPlanner.EventType.Offline,
                CreatorId = 4,
                CategoryId = 11,
                AddressId = 9
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
            },
            new Ticket
            {
                Id = 2,
                EventId = 2,
                Title = "Входной билет",
                Limit = 10,
                Price = 0,
                Until = new DateTime(2023, 01, 12, 0, 0, 0)
            },
            new Ticket
            {
                Id = 3,
                EventId = 3,
                Title = "Входной билет",
                Limit = 10,
                Price = 0,
                Until = new DateTime(2023, 01, 12, 0, 0, 0)
            },
            new Ticket
            {
                Id = 4,
                EventId = 4,
                Title = "Входной билет",
                Limit = 10,
                Price = 2500,
                Until = new DateTime(2023, 01, 12, 0, 0, 0)
            },
            new Ticket
            {
                Id = 5,
                EventId = 5,
                Title = "Входной билет",
                Limit = 10,
                Price = 50,
                Until = new DateTime(2023, 03, 20, 0, 0, 0).AddMonths(3)
            },
            new Ticket
            {
                Id = 6,
                EventId = 5,
                Title = "VIP-билет",
                Limit = 10,
                Price = 500,
                Until = new DateTime(2023, 03, 20, 0, 0, 0).AddMonths(3)
            },
            new Ticket
            {
                Id = 7,
                EventId = 6,
                Title = "Входной билет",
                Limit = 10,
                Price = 200,
                Until = new DateTime(2023, 04, 4, 0, 0, 0).AddMonths(3)
            },
            new Ticket
            {
                Id = 8,
                EventId = 7,
                Title = "Входной билет",
                Limit = 10,
                Price = 100,
                Until = new DateTime(2023, 03, 21, 0, 0, 0).AddMonths(3)
            },
            new Ticket
            {
                Id = 9,
                EventId = 7,
                Title = "Премиум билет",
                Limit = 10,
                Price = 300,
                Until = new DateTime(2023, 03, 21, 0, 0, 0).AddMonths(3)
            },
            new Ticket
            {
                Id = 10,
                EventId = 8,
                Title = "Входной билет",
                Limit = 10,
                Price = 0,
                Until = new DateTime(2023, 03, 20, 0, 0, 0).AddMonths(3)
            },
            new Ticket
            {
                Id = 11,
                EventId = 8,
                Title = "VIP-билет",
                Limit = 10,
                Price = 700,
                Until = new DateTime(2023, 03, 20, 0, 0, 0).AddMonths(3)
            },
            new Ticket
            {
                Id = 12,
                EventId = 9,
                Title = "Входной билет",
                Limit = 10,
                Price = 0,
                Until = new DateTime(2023, 04, 4, 0, 0, 0).AddMonths(3)
            },
            new Ticket
            {
                Id = 13,
                EventId = 10,
                Title = "Входной билет",
                Limit = 10,
                Price = 300,
                Until = new DateTime(2023, 03, 23, 0, 0, 0).AddMonths(3)
            },
            new Ticket
            {
                Id = 14,
                EventId = 10,
                Title = "Премиум билет",
                Limit = 10,
                Price = 1000,
                Until = new DateTime(2023, 03, 23, 0, 0, 0).AddMonths(3)
            },
            new Ticket
            {
                Id = 15,
                EventId = 11,
                Title = "Входной билет",
                Limit = 10,
                Price = 150,
                Until = new DateTime(2023, 05, 05, 0, 0, 0).AddMonths(3)
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
            },
            new Question
            {
                Id = 4,
                EventId = 2,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 5,
                EventId = 2,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 6,
                EventId = 2,
                Title = "Ваша Фамилия",
                IsEditable = false
            },
            new Question
            {
                Id = 7,
                EventId = 3,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 8,
                EventId = 3,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 9,
                EventId = 3,
                Title = "Ваша Фамилия",
                IsEditable = false
            },
            new Question
            {
                Id = 10,
                EventId = 4,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 11,
                EventId = 4,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 12,
                EventId = 4,
                Title = "Ваша Фамилия",
                IsEditable = false
            },
            new Question
            {
                Id = 13,
                EventId = 5,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 14,
                EventId = 5,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 15,
                EventId = 5,
                Title = "Ваша Фамилия",
                IsEditable = false
            },
            new Question
            {
                Id = 16,
                EventId = 6,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 17,
                EventId = 6,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 18,
                EventId = 6,
                Title = "Ваша Фамилия",
                IsEditable = false
            },
            new Question
            {
                Id = 19,
                EventId = 7,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 20,
                EventId = 7,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 21,
                EventId = 7,
                Title = "Ваша Фамилия",
                IsEditable = false
            },
            new Question
            {
                Id = 22,
                EventId = 8,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 23,
                EventId = 8,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 24,
                EventId = 8,
                Title = "Ваша Фамилия",
                IsEditable = false
            },
            new Question
            {
                Id = 25,
                EventId = 9,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 26,
                EventId = 9,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 27,
                EventId = 9,
                Title = "Ваша Фамилия",
                IsEditable = false
            },
            new Question
            {
                Id = 28,
                EventId = 10,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 29,
                EventId = 10,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 30,
                EventId = 10,
                Title = "Ваша Фамилия",
                IsEditable = false
            },
            new Question
            {
                Id = 31,
                EventId = 11,
                Title = "Email",
                IsEditable = false
            },
            new Question
            {
                Id = 32,
                EventId = 11,
                Title = "Ваше Имя",
                IsEditable = false
            },
            new Question
            {
                Id = 33,
                EventId = 11,
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
            },
            new Sale
            {
                Id = 3,
                TicketId = 1,
                UserId = 5,
                SaleDate = new DateTime(2022, 12, 21, 0, 0, 0)
            },
            new Sale
            {
                Id = 4,
                TicketId = 2,
                UserId = 1,
                SaleDate = new DateTime(2022, 12, 21, 0, 0, 0)
            },
            new Sale
            {
                Id = 5,
                TicketId = 3,
                UserId = 2,
                SaleDate = new DateTime(2022, 12, 21, 0, 0, 0)
            },
            new Sale
            {
                Id = 6,
                TicketId = 3,
                UserId = 3,
                SaleDate = new DateTime(2022, 12, 21, 0, 0, 0)
            },
            new Sale
            {
                Id = 7,
                TicketId = 3,
                UserId = 6,
                SaleDate = new DateTime(2022, 12, 21, 0, 0, 0)
            },
            new Sale
            {
                Id = 8,
                TicketId = 4,
                UserId = 3,
                SaleDate = new DateTime(2022, 12, 21, 0, 0, 0)
            },
            new Sale
            {
                Id = 9,
                TicketId = 4,
                UserId = 5,
                SaleDate = new DateTime(2022, 12, 21, 0, 0, 0)
            },
            new Sale
            {
                Id = 10,
                TicketId = 4,
                UserId = 6,
                SaleDate = new DateTime(2022, 12, 21, 0, 0, 0)
            },
            new Sale
            {
                Id = 11,
                TicketId = 5,
                UserId = 3,
                SaleDate = DateTime.Now.AddDays(-10)
            },
            new Sale
            {
                Id = 12,
                TicketId = 6,
                UserId = 5,
                SaleDate = DateTime.Now.AddDays(-8)
            },
            new Sale
            {
                Id = 13,
                TicketId = 7,
                UserId = 7,
                SaleDate = DateTime.Now.AddDays(-14)
            },
            new Sale
            {
                Id = 14,
                TicketId = 10,
                UserId = 3,
                SaleDate = DateTime.Now.AddDays(-17)
            },
            new Sale
            {
                Id = 15,
                TicketId = 11,
                UserId = 6,
                SaleDate = DateTime.Now.AddDays(-12)
            },
            new Sale
            {
                Id = 16,
                TicketId = 10,
                UserId = 8,
                SaleDate = DateTime.Now.AddDays(-9)
            },
            new Sale
            {
                Id = 17,
                TicketId = 12,
                UserId = 1,
                SaleDate = DateTime.Now.AddDays(-21)
            },
            new Sale
            {
                Id = 18,
                TicketId = 13,
                UserId = 4,
                SaleDate = DateTime.Now.AddDays(-6)
            }
        );

        builder.Entity<Review>().HasData(
            new Review
            {
                Id = 1,
                SaleId = 1,
                Rating = 5,
            },
            new Review
            {
                Id = 2,
                SaleId = 2,
                Rating = 4,
            },
            new Review
            {
                Id = 3,
                SaleId = 4,
                Rating = 4,
            },
            new Review
            {
                Id = 4,
                SaleId = 5,
                Rating = 5,
            },
            new Review
            {
                Id = 5,
                SaleId = 6,
                Rating = 4,
            },
            new Review
            {
                Id = 6,
                SaleId = 7,
                Rating = 5,
            },
            new Review
            {
                Id = 7,
                SaleId = 8,
                Rating = 4,
            },
            new Review
            {
                Id = 8,
                SaleId = 9,
                Rating = 4,
            },
            new Review
            {
                Id = 9,
                SaleId = 10,
                Rating = 3,
            }
        );

        builder.Entity<FavEvent>().HasData(
            new FavEvent
            {
                Id = 1,
                UserId = 5,
                EventId = 5
            },
            new FavEvent
            {
                Id = 2,
                UserId = 7,
                EventId = 5
            },
            new FavEvent
            {
                Id = 3,
                UserId = 7,
                EventId = 6
            },
            new FavEvent
            {
                Id = 4,
                UserId = 4,
                EventId = 8
            },
            new FavEvent
            {
                Id = 5,
                UserId = 3,
                EventId = 8
            },
            new FavEvent
            {
                Id = 6,
                UserId = 1,
                EventId = 8
            },
            new FavEvent
            {
                Id = 7,
                UserId = 4,
                EventId = 10
            },
            new FavEvent
            {
                Id = 8,
                UserId = 6,
                EventId = 10
            }
        );
    }
}
