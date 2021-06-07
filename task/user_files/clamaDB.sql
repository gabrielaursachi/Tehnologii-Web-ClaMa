PGDMP     -                    y           clama    13.2    13.2 <    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                        0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16962    clama    DATABASE     d   CREATE DATABASE clama WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Romanian_Romania.1250';
    DROP DATABASE clama;
                postgres    false            �            1259    17021    assignments    TABLE       CREATE TABLE public.assignments (
    id integer NOT NULL,
    id_class integer,
    id_author integer,
    title character varying(100),
    body character varying(1000),
    created_at timestamp without time zone,
    deadline timestamp without time zone,
    files bytea
);
    DROP TABLE public.assignments;
       public         heap    postgres    false            �            1259    17019    assignments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.assignments_id_seq;
       public          postgres    false    208                       0    0    assignments_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;
          public          postgres    false    207            �            1259    16977    classes    TABLE     �  CREATE TABLE public.classes (
    id integer NOT NULL,
    title character varying(100),
    day_of_occurence character varying(10),
    start_class time without time zone,
    end_class time without time zone,
    enter_code character varying(50),
    course_site_link character varying(300),
    no_components integer,
    formula character varying(50),
    other_platforms character varying(300),
    begin_class time without time zone
);
    DROP TABLE public.classes;
       public         heap    postgres    false            �            1259    17262    classes_catalog    TABLE       CREATE TABLE public.classes_catalog (
    id_class integer NOT NULL,
    id_student integer NOT NULL,
    presences integer,
    c1 double precision,
    c2 double precision,
    c3 double precision,
    c4 double precision,
    c5 double precision,
    bonus double precision
);
 #   DROP TABLE public.classes_catalog;
       public         heap    postgres    false            �            1259    16975    classes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.classes_id_seq;
       public          postgres    false    203                       0    0    classes_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;
          public          postgres    false    202            �            1259    17069    classes_requests    TABLE     W   CREATE TABLE public.classes_requests (
    id_class integer,
    id_student integer
);
 $   DROP TABLE public.classes_requests;
       public         heap    postgres    false            �            1259    17005    news    TABLE     �   CREATE TABLE public.news (
    id integer NOT NULL,
    id_class integer,
    title character varying(50),
    body character varying(1000),
    files bytea
);
    DROP TABLE public.news;
       public         heap    postgres    false            �            1259    17003    news_id_seq    SEQUENCE     �   CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.news_id_seq;
       public          postgres    false    206                       0    0    news_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;
          public          postgres    false    205            �            1259    17277    students_assignments    TABLE     �   CREATE TABLE public.students_assignments (
    id_assignment integer,
    id_student integer,
    body character varying(500),
    files bytea,
    id integer NOT NULL
);
 (   DROP TABLE public.students_assignments;
       public         heap    postgres    false            �            1259    17311    students_assignments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.students_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.students_assignments_id_seq;
       public          postgres    false    211                       0    0    students_assignments_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.students_assignments_id_seq OWNED BY public.students_assignments.id;
          public          postgres    false    212            �            1259    16988    user_classes    TABLE     �   CREATE TABLE public.user_classes (
    id_user integer NOT NULL,
    id_class integer NOT NULL,
    type character varying(10)
);
     DROP TABLE public.user_classes;
       public         heap    postgres    false            �            1259    16965    users    TABLE     <  CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    username character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    surname character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    type character varying(10) NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16963    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    201                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    200            N           2604    17024    assignments id    DEFAULT     p   ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);
 =   ALTER TABLE public.assignments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    208    207    208            L           2604    16980 
   classes id    DEFAULT     h   ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);
 9   ALTER TABLE public.classes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    202    203    203            M           2604    17008    news id    DEFAULT     b   ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);
 6   ALTER TABLE public.news ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    206    205    206            O           2604    17313    students_assignments id    DEFAULT     �   ALTER TABLE ONLY public.students_assignments ALTER COLUMN id SET DEFAULT nextval('public.students_assignments_id_seq'::regclass);
 F   ALTER TABLE public.students_assignments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    211            K           2604    16968    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    201    200    201            �          0    17021    assignments 
   TABLE DATA           h   COPY public.assignments (id, id_class, id_author, title, body, created_at, deadline, files) FROM stdin;
    public          postgres    false    208   `K       �          0    16977    classes 
   TABLE DATA           �   COPY public.classes (id, title, day_of_occurence, start_class, end_class, enter_code, course_site_link, no_components, formula, other_platforms, begin_class) FROM stdin;
    public          postgres    false    203   L       �          0    17262    classes_catalog 
   TABLE DATA           e   COPY public.classes_catalog (id_class, id_student, presences, c1, c2, c3, c4, c5, bonus) FROM stdin;
    public          postgres    false    210   M       �          0    17069    classes_requests 
   TABLE DATA           @   COPY public.classes_requests (id_class, id_student) FROM stdin;
    public          postgres    false    209   WM       �          0    17005    news 
   TABLE DATA           @   COPY public.news (id, id_class, title, body, files) FROM stdin;
    public          postgres    false    206   ~M       �          0    17277    students_assignments 
   TABLE DATA           Z   COPY public.students_assignments (id_assignment, id_student, body, files, id) FROM stdin;
    public          postgres    false    211   �M       �          0    16988    user_classes 
   TABLE DATA           ?   COPY public.user_classes (id_user, id_class, type) FROM stdin;
    public          postgres    false    204   �M       �          0    16965    users 
   TABLE DATA           S   COPY public.users (id, email, username, name, surname, password, type) FROM stdin;
    public          postgres    false    201   N                  0    0    assignments_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.assignments_id_seq', 3, true);
          public          postgres    false    207                       0    0    classes_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.classes_id_seq', 16, true);
          public          postgres    false    202            	           0    0    news_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.news_id_seq', 1, false);
          public          postgres    false    205            
           0    0    students_assignments_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.students_assignments_id_seq', 6, true);
          public          postgres    false    212                       0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 76, true);
          public          postgres    false    200            ]           2606    17029    assignments assignments_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.assignments DROP CONSTRAINT assignments_pkey;
       public            postgres    false    208            W           2606    16985    classes classes_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.classes DROP CONSTRAINT classes_pkey;
       public            postgres    false    203            [           2606    17013    news news_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.news DROP CONSTRAINT news_pkey;
       public            postgres    false    206            _           2606    17266 '   classes_catalog student_grades_in_class 
   CONSTRAINT     w   ALTER TABLE ONLY public.classes_catalog
    ADD CONSTRAINT student_grades_in_class PRIMARY KEY (id_student, id_class);
 Q   ALTER TABLE ONLY public.classes_catalog DROP CONSTRAINT student_grades_in_class;
       public            postgres    false    210    210            a           2606    17321 .   students_assignments students_assignments_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.students_assignments
    ADD CONSTRAINT students_assignments_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.students_assignments DROP CONSTRAINT students_assignments_pkey;
       public            postgres    false    211            Y           2606    16992    user_classes user_in_class 
   CONSTRAINT     g   ALTER TABLE ONLY public.user_classes
    ADD CONSTRAINT user_in_class PRIMARY KEY (id_user, id_class);
 D   ALTER TABLE ONLY public.user_classes DROP CONSTRAINT user_in_class;
       public            postgres    false    204    204            Q           2606    16972    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    201            S           2606    16970    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    201            U           2606    16974    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    201            f           2606    17035 &   assignments assignments_id_author_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_id_author_fkey FOREIGN KEY (id_author) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.assignments DROP CONSTRAINT assignments_id_author_fkey;
       public          postgres    false    201    208    2899            e           2606    17030 %   assignments assignments_id_class_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_id_class_fkey FOREIGN KEY (id_class) REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.assignments DROP CONSTRAINT assignments_id_class_fkey;
       public          postgres    false    2903    208    203            i           2606    17267 -   classes_catalog classes_catalog_id_class_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.classes_catalog
    ADD CONSTRAINT classes_catalog_id_class_fkey FOREIGN KEY (id_class) REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.classes_catalog DROP CONSTRAINT classes_catalog_id_class_fkey;
       public          postgres    false    203    2903    210            j           2606    17272 /   classes_catalog classes_catalog_id_student_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.classes_catalog
    ADD CONSTRAINT classes_catalog_id_student_fkey FOREIGN KEY (id_student) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.classes_catalog DROP CONSTRAINT classes_catalog_id_student_fkey;
       public          postgres    false    210    201    2899            g           2606    17072 /   classes_requests classes_requests_id_class_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.classes_requests
    ADD CONSTRAINT classes_requests_id_class_fkey FOREIGN KEY (id_class) REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.classes_requests DROP CONSTRAINT classes_requests_id_class_fkey;
       public          postgres    false    203    209    2903            h           2606    17077 1   classes_requests classes_requests_id_student_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.classes_requests
    ADD CONSTRAINT classes_requests_id_student_fkey FOREIGN KEY (id_student) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.classes_requests DROP CONSTRAINT classes_requests_id_student_fkey;
       public          postgres    false    209    2899    201            d           2606    17014    news news_id_class_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_id_class_fkey FOREIGN KEY (id_class) REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE;
 A   ALTER TABLE ONLY public.news DROP CONSTRAINT news_id_class_fkey;
       public          postgres    false    206    2903    203            k           2606    17283 <   students_assignments students_assignments_id_assignment_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.students_assignments
    ADD CONSTRAINT students_assignments_id_assignment_fkey FOREIGN KEY (id_assignment) REFERENCES public.assignments(id) ON UPDATE CASCADE ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.students_assignments DROP CONSTRAINT students_assignments_id_assignment_fkey;
       public          postgres    false    2909    211    208            l           2606    17288 9   students_assignments students_assignments_id_student_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.students_assignments
    ADD CONSTRAINT students_assignments_id_student_fkey FOREIGN KEY (id_student) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 c   ALTER TABLE ONLY public.students_assignments DROP CONSTRAINT students_assignments_id_student_fkey;
       public          postgres    false    2899    211    201            c           2606    16998 '   user_classes user_classes_id_class_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_classes
    ADD CONSTRAINT user_classes_id_class_fkey FOREIGN KEY (id_class) REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.user_classes DROP CONSTRAINT user_classes_id_class_fkey;
       public          postgres    false    204    203    2903            b           2606    16993 &   user_classes user_classes_id_user_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_classes
    ADD CONSTRAINT user_classes_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.user_classes DROP CONSTRAINT user_classes_id_user_fkey;
       public          postgres    false    2899    204    201            �   �   x�}�A
�0����n��Lb5�
]�nlтI1���

-����gJ;��88?Z� �C��=^1�V&�Q���}�LU�tM�f̕��z�m�\/[gRo'�͛0��~���o�q��T�*���ͲZ�勃Z�gt�nW#�)�Nlr!�d~Cf      �   �   x�}�;k1��_��}&z��.p��E.�NZ�	b�H'��oϝR���of$,W�#�)Y�R��p �Il�aԹ��v�6�8�ưN��u`Y;�b�?uN�ޑ6-7!�D���`�'��+�.�-T�B������|��+�qq�.��_�w�ῼ�9y����&D׵�˶�u�yn'oN�Z\�Pn�{s��|����G��c�q��I,�q�zo�%������I����	pE5���|�ICފE��sO      �   +   x�3�43�4�4׳�4�3��"=c.#�\	q��qqq C?%      �      x�3�43�2f2F��� 7M�      �      x������ � �      �      x�3�4���!.#ǔ+F��� Y�X      �   8   x�33�4�,.)MI�+�23�4Bp,�8��@eE�i���E �h������ C��      �   �  x�]�G��@����k�"awT�
X�����%H��Ϭ�]]�,���,��仃a�^��2O�*�LP�ŭ�/���jle�J+�8D"��տ�H�)60e�^�A��?V�zE�Unjנ�j?Ȫ+ ]�A�OBo��i��sz1.�Y�%Q���&��������C5;[�D���%�Kw8|�8�A���o�_ԫ�5���Ϭ�rt蝣�XI�v�ߍ㷍��ݞ��[�]G���IE�o�����8A^ 3x��$	Ԋ9(�[����f�l���SM�����/��6�i�1mQ'�7�����d���`1����1��)M��c���|���7�J�"gD�+��4�v�[X���[��ֺ1�޼1��;Di�\�u/q��$Y�Z��\��e�e9�gj|ԩ���1y�!km%����W(�X�(U�7�I�u,����6�xo���d�G�ݚT��n��wF�FH-H_㭪S�	gd͡_��(c��kjہS��2/��a�����gػě�w���ȗ�hq���'d�5$�Wٳ���X��2��Ʀ�<��i���J}CY�z���vE	����n���%�0���8J��ճ�NC{w��Q�6-Տ$�@9����� �4A
     