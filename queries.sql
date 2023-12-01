create table users (
    id int unsigned auto_increment primary key,
    full_name varchar(255),
    mobile varchar(255),
    password varchar(50),
    location_id int,
    gender varchar(50),
    is_admin boolean default false
);

create table locations (
    id int unsigned auto_increment primary key,
    name varchar(255),
    tags text
);

create table transactions (
    id int unsigned auto_increment primary key,
    user_id int,
    timestamp timestamp default current_timestamp,
    amount int
);