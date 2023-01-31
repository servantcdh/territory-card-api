<p align="center">
  <a href="https://www.jwterritory.co.kr/" target="blank"><img src="https://github.com/servantcdh/territory-card/blob/main/public/loading.gif?raw=true" width="200" alt="하늘수레버전 로딩화면" /></a>
</p>

## TerritoryCard - 구역 카드 시스템

TerritoryCard는 성경 마태복음 28:19, 20의 그리스도의 명령과 1세기 그리스도인들의 본을 따르기 위해 노력하는 사람들을 위해 만든 봉사 구역 카드 관리 시스템입니다.

본 저장소는 TerriotoryCard의 BE 프로젝트를 관리하는 공간입니다.

(TerritoryCard의 FE 프로젝트 저장소를 방문하시려면 [여기](https://github.com/servantcdh/territory-card)를 클릭하세요.)

## README.md를 이렇게 활용하려고 합니다.

1. TerritoryCard의 제작 과정을 기록합니다.
2. 단기 목표를 설정하고 구현하는데 사용한 라이브러리나 레퍼런스를 함께 기록합니다.
3. 특별히 인상적이었던 점이 있다면 또한 기록합니다.

## 이번 목표

- 카드 배정된 유저에게 FCM 발송 구현

## 사용한 라이브러리

| name                  | version    | explain                                                           |
| --------------------- | ---------- | ----------------------------------------------------------------- |
| nestjs                | _^9.2.1_   | nestjs 설치                                                       |
| class-validator       | _^0.13.2_  | dto에 타입 유효성 데코레이터 적용, controller request 유효성 검사 |
| class-transformer     | _^0.5.1_   | dto에 형변환 데코레이터 적용, request params의 string 값을 형변환 |
| @nestjs/mapped-types  | _^1.2.0_   | dto를 상속받아 모든 요소에 자동으로 isOptional 데코레이터 명시    |
| @nestjs/typeorm       | _^9.0.1_   | typeorm typescript d.ts 제공                                      |
| typeorm               | _^0.3.11_  | typeorm 설치                                                      |
| mysql2                | _^2.3.3_   | mysql2 설치                                                       |
| @nestjs/config        | _^2.2.0_   | 환경 변수 관리                                                    |
| exceljs               | _^4.3.0_   | javascript excel library                                          |
| cross-env             | _^7.0.3_   | npm script에서 환경 변수 지정할 때 사용                           |
| joi                   | _^17.7.0_  | 환경 변수 유효성 체크                                             |
| @nestjs/passport      | _^9.0.0_   | controller authGuard 구현                                         |
| passport              | _^0.6.0_   | passport-local 의존성 모듈, strategy 구현에 필요                  |
| passport-local        | _^1.0.0_   | local strategy validate 구현                                      |
| @types/passport-local | _^1.0.34_  | passport-local typescript d.ts 제공                               |
| bcrypt                | _^5.1.0_   | 패스워드 단방향 암호화                                            |
| @types/bcrypt         | _^5.0.0_   | bcrypt typescript d.ts 제공                                       |
| @nestjs/jwt           | _^9.0.0_   | jwt 생성 및 검증                                                  |
| passport-jwt          | _^4.0.0_   | jwt strategy validate 구현                                        |
| @types/passport-jwt   | _^3.0.8_   | passport-jwt typescript d.ts 제공                                 |
| @nestjs/serve-static  | _^3.0.0_   | 정적 파일 서버 구현                                               |
| docx-templates        | _^4.9.2_   | javascript docx template library                                  |
| @aws-sdk/client-s3    | _^3.238.0_ | AWS S3 엑세스 인터페이스 제공                                     |
| multer-s3             | _^3.0.1_   | S3 파일 업로드용 multer                                           |
| @types/multer-s3      | _^3.0.0_   | multer-s3 typescript d.ts 제공                                    |
| cookie-parser         | _^1.4.6_   | express cookie 조작 라이브러리                                    |
| @types/cookie-parser  | _^1.4.3_   | cookie-parser typescript d.ts 제공                                |
| firebase-admin        | _^11.4.1_  | Firebase Admin 라이브러리                                       |

## 특이 사항

1. 가비아 네임서버를 AWS Route 53의 호스팅 영역 세부 정보에 있는 네임서버로 수정한다.

2. ELB 설정 전 Target Group를 생성할 때 EC2에서 사용하는 포트를 입력해주어야 한다.

3. ELB 리스너 중 HTTP:80를 HTTPS:443 리다이렉트 시키도록 Edit한다.

4. 위의 네 가지를 하지못해 이틀을 고생했다. 이번 경험으로 EC2, S3, CloudFront, ELB, Route 53, Certificate Manager 등 많은 기능들을 사용할 수 있게 되었다. 큰 수확이다.

## 참고한 곳

[[AWS] EC2 도메인 연결 및 HTTPS 적용하기 - PgmJUN](https://pgmjun.tistory.com/69)

[How to enable CORS for multiple domains in Nest.js - Nandu Singh, morioh.com](https://morioh.com/p/bad87f42e5dd)

## 만든이

- Author - [DonghoChoi](https://github.com/servantcdh)
- github - [servantcdh](https://github.com/servantcdh)
- Email - [servantcdh@naver.com](servantcdh@naver.com)
