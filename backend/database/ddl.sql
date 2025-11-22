create table public.qes_user
(
    user_id uuid not null
        constraint pk_user
            primary key
);

alter table public.qes_user
    owner to lyc_question;

create table public.qes_user_join
(
    user_id  uuid not null,
    space_id uuid not null,
    constraint pk_user_join
        primary key (user_id, space_id)
);

alter table public.qes_user_join
    owner to lyc_question;

create table public.qes_space
(
    space_id      uuid                  not null
        constraint pk_space
            primary key,
    owner_user_id uuid                  not null,
    name          text                  not null,
    opened_time   timestamp             not null,
    end_time      timestamp,
    is_closed     boolean default false not null
);

alter table public.qes_space
    owner to lyc_question;

create table public.qes_question
(
    space_id    uuid      not null,
    question_id uuid      not null,
    question_no integer   not null,
    type        char(2)   not null,
    description text      not null,
    end_time    timestamp not null,
    constraint pk_question
        primary key (space_id, question_id)
);

alter table public.qes_question
    owner to lyc_question;

create table public.qes_answer
(
    question_id uuid    not null,
    answer_id   uuid    not null,
    answer_no   integer not null,
    description text    not null,
    constraint pk_answer
        primary key (question_id, answer_id)
);

alter table public.qes_answer
    owner to lyc_question;

create table public.qes_answer_history
(
    user_id     uuid not null,
    question_id uuid not null,
    answer_id   uuid not null,
    constraint pk_answer_history
        primary key (user_id, question_id)
);

alter table public.qes_answer_history
    owner to lyc_question;

