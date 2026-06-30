# TS Boilerplate — Node.js + Clean Architecture (Modular)

Boilerplate สำหรับสร้าง REST API ด้วย Node.js + TypeScript โดยใช้แนวคิด **Clean Architecture** ผสม **Modular Design** (แบ่งตาม feature/domain) เหมาะกับโปรเจกต์ระดับ production ที่ต้องการความสามารถในการเทส, สลับ technology, และ scale ทีมได้ในระยะยาว

---

## สารบัญ

- [แนวคิดหลัก](#แนวคิดหลัก)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [คำอธิบายแต่ละ Layer](#คำอธิบายแต่ละ-layer)
- [Flow การไหลของ Request](#flow-การไหลของ-request)
- [Dependency Rule](#dependency-rule)
- [การติดตั้งและรัน](#การติดตั้งและรัน)
- [Module ที่มีให้ในตัวอย่าง](#module-ที่มีให้ในตัวอย่าง)
- [หลักการตั้งชื่อไฟล์](#หลักการตั้งชื่อไฟล์)

---

## แนวคิดหลัก

โปรเจกต์นี้แบ่งโค้ดออกเป็น **4 layer** ต่อ 1 module (เช่น `user`, `auth`) โดยแต่ละ layer มีหน้าที่ชัดเจนและไม่ก้าวก่ายกัน:

```
presentation  →  application  →  domain
                       ↑
                infrastructure
```

กฎเหล็กข้อเดียวที่ต้องจำ: **dependency ไหลเข้าหา domain เท่านั้น ห้ามไหลย้อนกลับออกไป**

- `domain` ไม่รู้จักใครเลย เป็น pure TypeScript ล้วนๆ
- `application` รู้จักแค่ `domain`
- `infrastructure` implement สิ่งที่ `domain` กำหนดไว้ (repository interface)
- `presentation` เรียกใช้ `application` เท่านั้น ไม่ลัดไปแตะ `domain`/`infrastructure` ตรงๆ

ข้อดีที่ได้จากการแบ่งแบบนี้คือ ถ้าวันหนึ่งต้องเปลี่ยนจาก MongoDB เป็น PostgreSQL หรือเปลี่ยนจาก Express เป็น Fastify จะแก้แค่ `infrastructure`/`presentation` โดยที่ business logic หลัก (`domain`, `application`) ไม่ต้องแตะเลยแม้แต่บรรทัดเดียว

---

## โครงสร้างโปรเจกต์

```
src/
├── modules/                        # แบ่งโค้ดตาม domain/feature
│   ├── user/
│   │   ├── domain/                 # Layer 1: Business logic แกนกลาง
│   │   │   ├── entities/
│   │   │   │   └── User.ts
│   │   │   ├── repositories/       # interface (contract เท่านั้น)
│   │   │   │   └── IUserRepository.ts
│   │   │   └── errors/
│   │   │       └── UserErrors.ts
│   │   ├── application/            # Layer 2: Use cases (orchestration)
│   │   │   ├── useCases/
│   │   │   │   ├── CreateUser.ts
│   │   │   │   ├── GetUserById.ts
│   │   │   │   └── DeleteUser.ts
│   │   │   ├── mappers/
│   │   │   │   └── UserMapper.ts
│   │   │   └── dto/
│   │   │       └── UserDTO.ts
│   │   ├── infrastructure/         # Layer 3: รายละเอียดทาง technical
│   │   │   ├── repositories/
│   │   │   │   └── UserRepositoryMongo.ts
│   │   │   └── models/
│   │   │       └── UserModel.ts
│   │   └── presentation/           # Layer 4: HTTP / Controller
│   │       ├── controllers/
│   │       │   └── UserController.ts
│   │       ├── routes/
│   │       │   └── userRoutes.ts
│   │       └── validators/
│   │           └── userValidator.ts
│   └── auth/
│       └── ... (โครงสร้างเดียวกัน)
│
├── shared/                         # ของกลางที่ใช้ข้าม module
│   ├── errors/
│   │   └── AppError.ts
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   ├── asyncHandler.ts
│   │   ├── validate.ts
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── requestId.ts
│   │   └── requestLogger.ts
│   ├── constants/
│   │   └── userRole.ts
│   ├── config/
│   │   └── env.ts
│   └── utils/
│       └── logger.ts
│
├── container/                      # Dependency Injection (ประกอบทุก layer เข้าด้วยกัน)
│   ├── userContainer.ts
│   └── authContainer.ts
│
├── app.ts                          # ประกอบ Express app + mount routes
└── server.ts                       # entry point, เชื่อม DB, เริ่ม listen

tests/                              # อยู่นอก src/ เสมอ
├── unit/
├── integration/
└── e2e/

docs/                                # อยู่นอก src/ เสมอ
├── architecture.md
└── adr/
```

---

## คำอธิบายแต่ละ Layer

### Layer 1: Domain (แกนกลางของระบบ)

**หน้าที่:** เก็บ business rule และ entity ที่เป็นแก่นแท้ของระบบ ไม่ขึ้นกับ database, framework, หรือ HTTP ใดๆ ทั้งสิ้น

**สิ่งที่อยู่ในนี้:**
- **Entity** (`User.ts`) — class ที่มี state และ business rule ของตัวเอง เช่น `changeName()` ที่ validate ความยาวชื่อ
- **Repository Interface** (`IUserRepository.ts`) — สัญญา (contract) ว่า repository ต้องมี method อะไรบ้าง โดยไม่สนใจว่าจะ implement ด้วย MongoDB, PostgreSQL หรืออะไร
- **Domain Error** (`UserErrors.ts`) — error ที่เกิดจาก business rule ถูกละเมิด

**กฎสำคัญ:** ห้าม `import` อะไรจาก `application`, `infrastructure`, หรือ `presentation` เด็ดขาด แม้แต่ DTO ก็ห้าม import เข้ามา (เคยเป็นปัญหาที่เจอในโปรเจกต์นี้ตอนที่ `User.ts` ดัน import `UserOutput` จาก `application/dto` — ต้องแก้โดยย้าย mapping logic ออกไปเป็น `UserMapper` แทน)

```ts
// domain/entities/User.ts — ตัวอย่างที่ถูกต้อง
export class User {
  readonly id: string;
  name: string;
  // ...

  changeName(newName: string): void {
    if (!newName || newName.trim().length < 2) {
      throw new Error('Name too short'); // business rule อยู่ในนี้
    }
    this.name = newName;
  }
}
```

---

### Layer 2: Application (Use Cases)

**หน้าที่:** orchestrate การทำงาน — เรียก domain entity + repository (ผ่าน interface) มาทำงานร่วมกันเพื่อตอบสนอง 1 ความต้องการของ user (เช่น "สร้าง user ใหม่", "ลบ user")

**สิ่งที่อยู่ในนี้:**
- **Use Case** (`CreateUser.ts`, `DeleteUser.ts`) — 1 class = 1 การกระทำ ตั้งชื่อแบบ `{Verb}{Noun}`
- **DTO** (`UserDTO.ts`) — กำหนด shape ของ input/output ที่ use case รับ-คืนค่า
- **Mapper** (`UserMapper.ts`) — แปลง entity ให้กลายเป็น DTO ที่ปลอดภัยสำหรับส่งออกไปข้างนอก (เช่น ตัด `passwordHash` ออก)
- **Service Interface** (`ITokenService.ts`, `IPasswordHasher.ts`) — เป็น "port" ที่ use case เรียกใช้ โดยไม่ผูกกับ library เฉพาะเจาะจง (เช่น ไม่ import `bcrypt` ตรงๆ)

**กฎสำคัญ:** use case รับเข้าแค่ dependency ผ่าน constructor (Dependency Injection) และไม่รู้จัก `req`/`res` ของ Express เลย ทำให้เทสได้ง่ายมาก (mock แค่ repository ก็พอ) และเอาไปใช้กับ CLI, queue worker, หรือ GraphQL resolver ได้โดยไม่ต้องแก้

```ts
// application/useCases/CreateUser.ts
export class CreateUser {
  constructor(private readonly deps: Deps) {} // รับ dependency จากภายนอก ไม่ new เอง

  async execute(input: CreateUserInput): Promise<UserOutput> {
    const existing = await this.deps.userRepository.findByEmail(input.email);
    if (existing) throw new ConflictError(`Email ${input.email} already exists`);
    // ...
    return UserMapper.toOutput(user);
  }
}
```

---

### Layer 3: Infrastructure (รายละเอียดทาง technical)

**หน้าที่:** implement interface ที่ `domain` กำหนดไว้ ด้วย technology จริงที่เลือกใช้ (MongoDB, JWT, bcrypt ฯลฯ)

**สิ่งที่อยู่ในนี้:**
- **Model/Schema** (`UserModel.ts`) — Mongoose schema ที่ map กับ collection จริงใน MongoDB
- **Repository Implementation** (`UserRepositoryMongo.ts`) — `implements IUserRepository` แปลงข้อมูลระหว่าง MongoDB document กับ domain entity
- **External Service Adapter** (`JwtTokenService.ts`, `BcryptPasswordHasher.ts`) — implement `ITokenService`/`IPasswordHasher` ด้วย library จริง

**กฎสำคัญ:** ถ้าจะสลับจาก MongoDB ไปเป็น PostgreSQL วันหนึ่ง แค่เขียน `UserRepositoryPostgres.ts` ใหม่ที่ `implements IUserRepository` แบบเดียวกัน แล้วเปลี่ยนตัวที่ inject ใน container — ส่วน `application` และ `domain` ไม่ต้องแก้เลยแม้แต่บรรทัดเดียว

```ts
// infrastructure/repositories/UserRepositoryMongo.ts
export class UserRepositoryMongo implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ id }).lean();
    return doc ? this.toEntity(doc) : null; // แปลง Mongo doc → domain entity
  }
  // ...
}
```

---

### Layer 4: Presentation (HTTP / Controller)

**หน้าที่:** ชั้นนอกสุดที่ติดต่อกับโลกภายนอก รับ HTTP request แปลงเป็น input ให้ use case แล้วแปลง output กลับเป็น HTTP response

**สิ่งที่อยู่ในนี้:**
- **Validator** (`userValidator.ts`) — zod schema เช็ครูปแบบของ request (body/params/query) ก่อนเข้า controller
- **Controller** (`UserController.ts`) — รับ `req`, เรียก use case, ส่ง `res` กลับ ไม่มี business logic ใดๆ อยู่ในนี้
- **Route** (`userRoutes.ts`) — ผูก path + HTTP method + middleware (`authenticate`, `authorize`, `validate`) เข้ากับ controller method

**กฎสำคัญ:** controller ต้อง "บางที่สุด" — แค่แปลง `req` → input object, เรียก use case, แปลง output → `res.json()` เท่านั้น ถ้าเจอ business logic อยู่ใน controller แปลว่าวางผิดที่แล้ว

```ts
// presentation/controllers/UserController.ts
create = async (req: Request<{}, {}, CreateUserSchemaType>, res: Response): Promise<void> => {
  const result = await this.deps.createUser.execute(req.body); // เรียก use case อย่างเดียว
  res.status(201).json({ success: true, data: result });
};
```

---

## Flow การไหลของ Request

ตัวอย่าง flow เต็มของ `POST /api/v1/users` (สร้าง user ใหม่):

```
1. Client ส่ง HTTP Request
       │
       ▼
2. Middleware ทำงานตามลำดับ (ใน app.ts)
   helmet → cors → compression → express.json()
   → requestId → requestLogger
       │
       ▼
3. Route จับคู่ path (userRoutes.ts)
   POST /api/v1/users
       │
       ▼
4. Middleware เฉพาะ route
   validate(createUserSchema, 'body')   ← เช็ค format ของ req.body ด้วย zod
   (ถ้า validate ไม่ผ่าน → throw ValidationError → ข้ามไปที่ errorHandler ทันที)
       │
       ▼
5. Controller (UserController.create)
   - รับ req.body ที่ validate แล้ว (type-safe)
   - เรียก this.deps.createUser.execute(req.body)
       │
       ▼
6. Use Case (CreateUser.execute)
   - เรียก userRepository.findByEmail() ผ่าน interface (ยังไม่รู้ว่าเป็น MongoDB)
   - ถ้าซ้ำ → throw ConflictError
   - hash password ผ่าน bcrypt (inject เข้ามา)
   - สร้าง User entity ใหม่ (domain validate email format ใน constructor)
   - เรียก userRepository.save(user)
       │
       ▼
7. Repository Implementation (UserRepositoryMongo.save)
   - แปลง User entity → Mongoose document
   - เขียนลง MongoDB จริง
       │
       ▼
8. กลับขึ้นไปที่ Use Case
   - แปลง entity → DTO ผ่าน UserMapper.toOutput() (ตัด passwordHash ออก)
   - return UserOutput
       │
       ▼
9. กลับมาที่ Controller
   - res.status(201).json({ success: true, data: result })
       │
       ▼
10. Client ได้รับ Response
```

### Flow เมื่อเกิด Error (เช่น email ซ้ำ)

```
Use Case throw ConflictError
       │
       ▼
asyncHandler ดักจับ (เพราะ controller เป็น async function)
       │
       ▼
next(error) ส่งต่อไปที่ errorHandler middleware (ตัวสุดท้ายใน app.ts)
       │
       ▼
errorHandler เช็คว่าเป็น AppError ไหม
   - ใช่ → log ระดับ warn, ส่ง statusCode + message ที่ปลอดภัยกลับไป
   - ไม่ใช่ (bug จริง) → log ระดับ error พร้อม stack trace, ส่ง "Something went wrong" แบบ generic
       │
       ▼
Client ได้รับ JSON error response ตาม statusCode ที่ถูกต้อง
```

### Flow ของ Authentication (เช่น `GET /api/v1/users/me`)

```
Client ส่ง Request พร้อม Authorization: Bearer <token>
       │
       ▼
authenticate middleware
   - แกะ token จาก header
   - verify ผ่าน JwtTokenService
   - แปะ payload เข้า req.user
       │
       ▼
(ถ้า route ต้องเช็ค role เพิ่ม) authorize(USER_ROLE.ADMIN) middleware
   - เช็คว่า req.user.role อยู่ใน allowed roles ไหม
       │
       ▼
Controller (getMe) ใช้ req.user.userId แทนการรับจาก param
       │
       ▼
เรียก use case เดิม (GetUserById) ด้วย id จาก token
```

---

## Dependency Rule

แผนภาพสรุปทิศทางที่ import กันได้/ไม่ได้:

```
┌─────────────────────────────────────────────┐
│  presentation                                │
│  (controllers, routes, validators)           │
│         │ import ↓                           │
├─────────▼─────────────────────────────────────┤
│  application                                 │
│  (use cases, DTO, mapper, service interface) │
│         │ import ↓                           │
├─────────▼─────────────────────────────────────┤
│  domain                                      │
│  (entity, repository interface, error)       │
│  ⛔ ไม่ import จากที่ไหนเลย ⛔                │
└───────────────────────────────────────────────┘
         ▲
         │ implements
┌────────┴──────────────────────────────────────┐
│  infrastructure                                │
│  (Mongo model, repository impl, JWT/bcrypt)    │
└─────────────────────────────────────────────────┘
```

`infrastructure` ไม่ได้อยู่ "ใต้" สาย dependency หลัก — มันแค่ implement interface ที่ domain ประกาศไว้ (Dependency Inversion Principle) แล้วถูกประกอบเข้ากับของจริงที่ `container/` เท่านั้น

**สิ่งที่ห้ามทำเด็ดขาด:**
- ❌ `domain/entities/User.ts` import จาก `application/dto/`
- ❌ `application/useCases/CreateUser.ts` import `UserRepositoryMongo` ตรงๆ (ต้องผ่าน `IUserRepository` เท่านั้น)
- ❌ `presentation/controllers/UserController.ts` เขียน business logic เอง (เช่น เช็คว่า email ซ้ำหรือไม่)

---

## การติดตั้งและรัน

### Local (ไม่ใช้ Docker)

```bash
pnpm install
cp .env.example .env   # ตั้งค่า MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
pnpm dev                # รันด้วย tsx watch, hot reload
```

### Docker (Dev mode — hot reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Docker (Production)

```bash
docker compose -f docker-compose.yml up --build -d
```

### Build สำหรับ production จริง

```bash
pnpm build      # tsc + tsc-alias
pnpm start      # node dist/server.js
```

---

## Module ที่มีให้ในตัวอย่าง

| Module | หน้าที่ |
|---|---|
| `user` | CRUD ผู้ใช้, `/me` endpoint สำหรับดูข้อมูลตัวเอง |
| `auth` | login, refresh token (พร้อม token rotation), logout, revoke session |

| Middleware | หน้าที่ |
|---|---|
| `authenticate` | เช็คว่า request มี access token ที่ valid ไหม แปะ payload เข้า `req.user` |
| `authorize(...roles)` | เช็คว่า `req.user.role` อยู่ใน role ที่อนุญาตไหม (RBAC) |
| `validate(schema, source)` | validate `req.body`/`req.params`/`req.query` ด้วย zod |
| `requestId` | สร้าง/ส่งต่อ `x-request-id` เพื่อ trace request ข้าม log ได้ |
| `requestLogger` | log ทุก HTTP request พร้อม `requestId`, status, duration |
| `errorHandler` | จุดเดียวที่แปลง error ทุกชนิดเป็น HTTP response ที่สอดคล้องกัน |

---

## หลักการตั้งชื่อไฟล์

| Layer | Pattern | ตัวอย่าง |
|---|---|---|
| Entity | `{Noun}.ts` | `User.ts` |
| Repository Interface | `I{Noun}Repository.ts` | `IUserRepository.ts` |
| Use Case | `{Verb}{Noun}.ts` | `CreateUser.ts`, `DeleteUser.ts` |
| Mapper | `{Noun}Mapper.ts` | `UserMapper.ts` |
| Repository Implementation | `{Noun}Repository{Tech}.ts` | `UserRepositoryMongo.ts` |
| Controller | `{Noun}Controller.ts` | `UserController.ts` |
| Route | `{noun}Routes.ts` | `userRoutes.ts` |
| Validator | `{noun}Validator.ts` | `userValidator.ts` |

รายละเอียดเพิ่มเติมดูได้ที่ `docs/naming-convention-cheatsheet.md`

---

## License

MIT