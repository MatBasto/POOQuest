-- Datos iniciales de POOQuest. Ejecutar después de schema.sql

truncate table public.user_rewards,public.level_progress,public.code_executions,public.programming_challenges,public.activity_attempts,public.activity_options,public.activities,public.contents,public.levels,public.modules,public.rewards restart identity cascade;

insert into modules(slug,name,description,icon,theme,sort_order) values ('abstraccion','Abstracción','Modela lo esencial de un problema y deja fuera detalles que no aportan a la solución.','◇','blue',1);
insert into modules(slug,name,description,icon,theme,sort_order) values ('encapsulamiento','Encapsulamiento','Protege el estado de los objetos y controla cómo se accede a sus datos.','⬢','green',2);
insert into modules(slug,name,description,icon,theme,sort_order) values ('herencia','Herencia','Reutiliza atributos y comportamientos mediante relaciones entre clases.','♜','yellow',3);
insert into modules(slug,name,description,icon,theme,sort_order) values ('polimorfismo','Polimorfismo','Usa una misma interfaz para obtener comportamientos diferentes según el objeto.','⌘','purple',4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='abstraccion'),'intro-abstraccion','Introducción a la abstracción','Identifica qué información conservar al modelar un problema.',1,0,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='intro-abstraccion'),'Introducción a la abstracción','Una abstracción conserva las características importantes de un objeto o problema y deja fuera detalles innecesarios. En POO, una clase es una forma de representar esa idea mediante atributos y métodos.
En este nivel: Identifica qué información conservar al modelar un problema.',$code$class Cuenta {
    String titular;
    double saldo;
    void consignar(double valor) { saldo += valor; }
}$code$,'abstraction',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='intro-abstraccion'),'¿Cuál opción describe mejor la abstracción?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-abstraccion' order by a.id desc limit 1),'Mostrar todos los detalles internos',false,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-abstraccion' order by a.id desc limit 1),'Conservar lo esencial del problema y omitir detalles irrelevantes',true,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-abstraccion' order by a.id desc limit 1),'Hacer todos los atributos públicos',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-abstraccion' order by a.id desc limit 1),'Duplicar una clase',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='abstraccion'),'clases-objetos','Clases y objetos','Distingue el molde de las instancias que se crean a partir de él.',2,30,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='clases-objetos'),'Clases y objetos','Una abstracción conserva las características importantes de un objeto o problema y deja fuera detalles innecesarios. En POO, una clase es una forma de representar esa idea mediante atributos y métodos.
En este nivel: Distingue el molde de las instancias que se crean a partir de él.',$code$class Cuenta {
    String titular;
    double saldo;
    void consignar(double valor) { saldo += valor; }
}$code$,'abstraction',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='clases-objetos'),'¿Cuál opción describe mejor la abstracción?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='clases-objetos' order by a.id desc limit 1),'Mostrar todos los detalles internos',false,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='clases-objetos' order by a.id desc limit 1),'Conservar lo esencial del problema y omitir detalles irrelevantes',true,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='clases-objetos' order by a.id desc limit 1),'Hacer todos los atributos públicos',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='clases-objetos' order by a.id desc limit 1),'Duplicar una clase',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='abstraccion'),'atributos-metodos','Atributos y métodos','Representa estado y comportamiento dentro de una clase.',3,60,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='atributos-metodos'),'Atributos y métodos','Una abstracción conserva las características importantes de un objeto o problema y deja fuera detalles innecesarios. En POO, una clase es una forma de representar esa idea mediante atributos y métodos.
En este nivel: Representa estado y comportamiento dentro de una clase.',$code$class Cuenta {
    String titular;
    double saldo;
    void consignar(double valor) { saldo += valor; }
}$code$,'abstraction',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='atributos-metodos'),'¿Cuál opción describe mejor la abstracción?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='atributos-metodos' order by a.id desc limit 1),'Mostrar todos los detalles internos',false,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='atributos-metodos' order by a.id desc limit 1),'Conservar lo esencial del problema y omitir detalles irrelevantes',true,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='atributos-metodos' order by a.id desc limit 1),'Hacer todos los atributos públicos',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='atributos-metodos' order by a.id desc limit 1),'Duplicar una clase',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='abstraccion'),'modelado-problemas','Modelado de problemas','Convierte una situación cotidiana en un modelo orientado a objetos.',4,90,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='modelado-problemas'),'Modelado de problemas','Una abstracción conserva las características importantes de un objeto o problema y deja fuera detalles innecesarios. En POO, una clase es una forma de representar esa idea mediante atributos y métodos.
En este nivel: Convierte una situación cotidiana en un modelo orientado a objetos.',$code$class Cuenta {
    String titular;
    double saldo;
    void consignar(double valor) { saldo += valor; }
}$code$,'abstraction',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='modelado-problemas'),'¿Cuál opción describe mejor la abstracción?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='modelado-problemas' order by a.id desc limit 1),'Mostrar todos los detalles internos',false,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='modelado-problemas' order by a.id desc limit 1),'Conservar lo esencial del problema y omitir detalles irrelevantes',true,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='modelado-problemas' order by a.id desc limit 1),'Hacer todos los atributos públicos',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='modelado-problemas' order by a.id desc limit 1),'Duplicar una clase',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='abstraccion'),'reto-abstraccion','Reto final de abstracción','Integra los conceptos del módulo en un reto Java.',5,120,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='reto-abstraccion'),'Reto final de abstracción','Una abstracción conserva las características importantes de un objeto o problema y deja fuera detalles innecesarios. En POO, una clase es una forma de representar esa idea mediante atributos y métodos.
En este nivel: Integra los conceptos del módulo en un reto Java.',$code$class Cuenta {
    String titular;
    double saldo;
    void consignar(double valor) { saldo += valor; }
}$code$,'abstraction',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='reto-abstraccion'),'¿Cuál opción describe mejor la abstracción?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-abstraccion' order by a.id desc limit 1),'Mostrar todos los detalles internos',false,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-abstraccion' order by a.id desc limit 1),'Conservar lo esencial del problema y omitir detalles irrelevantes',true,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-abstraccion' order by a.id desc limit 1),'Hacer todos los atributos públicos',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-abstraccion' order by a.id desc limit 1),'Duplicar una clase',false,4);
insert into programming_challenges(level_id,title,statement,starter_code,expected_output,xp_reward) values ((select id from levels where slug='reto-abstraccion'),'Crear una clase Libro','Crea una clase Libro con título y autor, un constructor y un método mostrar() que imprima: POOQuest - Java.',$code$public class Main {
  public static void main(String[] args) {
    // Crea el objeto y muestra el resultado
  }
}
$code$,$out$POOQuest - Java$out$,30);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='encapsulamiento'),'intro-encapsulamiento','¿Por qué ocultar datos?','Comprende el propósito de controlar el acceso al estado.',1,180,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='intro-encapsulamiento'),'¿Por qué ocultar datos?','El encapsulamiento mantiene el estado interno protegido y obliga a usar operaciones controladas. Esto reduce cambios accidentales y permite validar los datos antes de modificarlos.
En este nivel: Comprende el propósito de controlar el acceso al estado.',$code$class Cuenta {
    private double saldo;
    public double getSaldo() { return saldo; }
    public void consignar(double valor) { if (valor > 0) saldo += valor; }
}$code$,'encapsulation',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='intro-encapsulamiento'),'¿Qué práctica representa encapsulamiento?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-encapsulamiento' order by a.id desc limit 1),'Declarar saldo private y modificarlo mediante métodos validados',true,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-encapsulamiento' order by a.id desc limit 1),'Usar solo variables globales',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-encapsulamiento' order by a.id desc limit 1),'Copiar atributos entre clases',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-encapsulamiento' order by a.id desc limit 1),'Eliminar los métodos',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='encapsulamiento'),'modificadores-acceso','Modificadores de acceso','Usa private y public de forma intencional.',2,210,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='modificadores-acceso'),'Modificadores de acceso','El encapsulamiento mantiene el estado interno protegido y obliga a usar operaciones controladas. Esto reduce cambios accidentales y permite validar los datos antes de modificarlos.
En este nivel: Usa private y public de forma intencional.',$code$class Cuenta {
    private double saldo;
    public double getSaldo() { return saldo; }
    public void consignar(double valor) { if (valor > 0) saldo += valor; }
}$code$,'encapsulation',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='modificadores-acceso'),'¿Qué práctica representa encapsulamiento?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='modificadores-acceso' order by a.id desc limit 1),'Declarar saldo private y modificarlo mediante métodos validados',true,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='modificadores-acceso' order by a.id desc limit 1),'Usar solo variables globales',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='modificadores-acceso' order by a.id desc limit 1),'Copiar atributos entre clases',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='modificadores-acceso' order by a.id desc limit 1),'Eliminar los métodos',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='encapsulamiento'),'getters-setters','Getters y setters','Expone operaciones seguras para leer y modificar datos.',3,240,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='getters-setters'),'Getters y setters','El encapsulamiento mantiene el estado interno protegido y obliga a usar operaciones controladas. Esto reduce cambios accidentales y permite validar los datos antes de modificarlos.
En este nivel: Expone operaciones seguras para leer y modificar datos.',$code$class Cuenta {
    private double saldo;
    public double getSaldo() { return saldo; }
    public void consignar(double valor) { if (valor > 0) saldo += valor; }
}$code$,'encapsulation',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='getters-setters'),'¿Qué práctica representa encapsulamiento?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='getters-setters' order by a.id desc limit 1),'Declarar saldo private y modificarlo mediante métodos validados',true,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='getters-setters' order by a.id desc limit 1),'Usar solo variables globales',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='getters-setters' order by a.id desc limit 1),'Copiar atributos entre clases',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='getters-setters' order by a.id desc limit 1),'Eliminar los métodos',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='encapsulamiento'),'validacion-estado','Validación del estado','Impide que un objeto quede en un estado inválido.',4,270,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='validacion-estado'),'Validación del estado','El encapsulamiento mantiene el estado interno protegido y obliga a usar operaciones controladas. Esto reduce cambios accidentales y permite validar los datos antes de modificarlos.
En este nivel: Impide que un objeto quede en un estado inválido.',$code$class Cuenta {
    private double saldo;
    public double getSaldo() { return saldo; }
    public void consignar(double valor) { if (valor > 0) saldo += valor; }
}$code$,'encapsulation',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='validacion-estado'),'¿Qué práctica representa encapsulamiento?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='validacion-estado' order by a.id desc limit 1),'Declarar saldo private y modificarlo mediante métodos validados',true,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='validacion-estado' order by a.id desc limit 1),'Usar solo variables globales',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='validacion-estado' order by a.id desc limit 1),'Copiar atributos entre clases',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='validacion-estado' order by a.id desc limit 1),'Eliminar los métodos',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='encapsulamiento'),'reto-encapsulamiento','Reto final de encapsulamiento','Construye una clase con reglas de acceso y validación.',5,300,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='reto-encapsulamiento'),'Reto final de encapsulamiento','El encapsulamiento mantiene el estado interno protegido y obliga a usar operaciones controladas. Esto reduce cambios accidentales y permite validar los datos antes de modificarlos.
En este nivel: Construye una clase con reglas de acceso y validación.',$code$class Cuenta {
    private double saldo;
    public double getSaldo() { return saldo; }
    public void consignar(double valor) { if (valor > 0) saldo += valor; }
}$code$,'encapsulation',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='reto-encapsulamiento'),'¿Qué práctica representa encapsulamiento?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-encapsulamiento' order by a.id desc limit 1),'Declarar saldo private y modificarlo mediante métodos validados',true,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-encapsulamiento' order by a.id desc limit 1),'Usar solo variables globales',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-encapsulamiento' order by a.id desc limit 1),'Copiar atributos entre clases',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-encapsulamiento' order by a.id desc limit 1),'Eliminar los métodos',false,4);
insert into programming_challenges(level_id,title,statement,starter_code,expected_output,xp_reward) values ((select id from levels where slug='reto-encapsulamiento'),'Validar una cuenta','Implementa una cuenta cuyo saldo no pueda disminuir al consignar un valor negativo. Imprime el saldo final 100.0.',$code$public class Main {
  public static void main(String[] args) {
    // Implementa Cuenta y prueba la validación
  }
}
$code$,$out$100.0$out$,30);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='herencia'),'intro-herencia','Relaciones de herencia','Reconoce relaciones "es un" entre clases.',1,360,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='intro-herencia'),'Relaciones de herencia','La herencia permite crear una clase a partir de otra. La clase hija conserva miembros accesibles de la clase base y puede agregar o especializar comportamiento.
En este nivel: Reconoce relaciones "es un" entre clases.',$code$class Animal { void sonido(){ System.out.println("..."); } }
class Perro extends Animal { @Override void sonido(){ System.out.println("Guau"); } }$code$,'inheritance',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='intro-herencia'),'¿Qué palabra clave usa Java para heredar de una clase?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-herencia' order by a.id desc limit 1),'implements',false,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-herencia' order by a.id desc limit 1),'inherits',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-herencia' order by a.id desc limit 1),'extends',true,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-herencia' order by a.id desc limit 1),'superclass',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='herencia'),'extends-super','extends y super','Hereda comportamiento e inicializa la clase base.',2,390,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='extends-super'),'extends y super','La herencia permite crear una clase a partir de otra. La clase hija conserva miembros accesibles de la clase base y puede agregar o especializar comportamiento.
En este nivel: Hereda comportamiento e inicializa la clase base.',$code$class Animal { void sonido(){ System.out.println("..."); } }
class Perro extends Animal { @Override void sonido(){ System.out.println("Guau"); } }$code$,'inheritance',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='extends-super'),'¿Qué palabra clave usa Java para heredar de una clase?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='extends-super' order by a.id desc limit 1),'implements',false,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='extends-super' order by a.id desc limit 1),'inherits',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='extends-super' order by a.id desc limit 1),'extends',true,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='extends-super' order by a.id desc limit 1),'superclass',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='herencia'),'sobrescritura','Sobrescritura','Especializa métodos heredados.',3,420,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='sobrescritura'),'Sobrescritura','La herencia permite crear una clase a partir de otra. La clase hija conserva miembros accesibles de la clase base y puede agregar o especializar comportamiento.
En este nivel: Especializa métodos heredados.',$code$class Animal { void sonido(){ System.out.println("..."); } }
class Perro extends Animal { @Override void sonido(){ System.out.println("Guau"); } }$code$,'inheritance',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='sobrescritura'),'¿Qué palabra clave usa Java para heredar de una clase?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='sobrescritura' order by a.id desc limit 1),'implements',false,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='sobrescritura' order by a.id desc limit 1),'inherits',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='sobrescritura' order by a.id desc limit 1),'extends',true,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='sobrescritura' order by a.id desc limit 1),'superclass',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='herencia'),'jerarquia-clases','Jerarquías de clases','Diseña una jerarquía pequeña sin duplicar comportamiento.',4,450,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='jerarquia-clases'),'Jerarquías de clases','La herencia permite crear una clase a partir de otra. La clase hija conserva miembros accesibles de la clase base y puede agregar o especializar comportamiento.
En este nivel: Diseña una jerarquía pequeña sin duplicar comportamiento.',$code$class Animal { void sonido(){ System.out.println("..."); } }
class Perro extends Animal { @Override void sonido(){ System.out.println("Guau"); } }$code$,'inheritance',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='jerarquia-clases'),'¿Qué palabra clave usa Java para heredar de una clase?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='jerarquia-clases' order by a.id desc limit 1),'implements',false,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='jerarquia-clases' order by a.id desc limit 1),'inherits',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='jerarquia-clases' order by a.id desc limit 1),'extends',true,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='jerarquia-clases' order by a.id desc limit 1),'superclass',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='herencia'),'reto-herencia','Reto final de herencia','Implementa una jerarquía funcional en Java.',5,480,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='reto-herencia'),'Reto final de herencia','La herencia permite crear una clase a partir de otra. La clase hija conserva miembros accesibles de la clase base y puede agregar o especializar comportamiento.
En este nivel: Implementa una jerarquía funcional en Java.',$code$class Animal { void sonido(){ System.out.println("..."); } }
class Perro extends Animal { @Override void sonido(){ System.out.println("Guau"); } }$code$,'inheritance',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='reto-herencia'),'¿Qué palabra clave usa Java para heredar de una clase?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-herencia' order by a.id desc limit 1),'implements',false,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-herencia' order by a.id desc limit 1),'inherits',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-herencia' order by a.id desc limit 1),'extends',true,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-herencia' order by a.id desc limit 1),'superclass',false,4);
insert into programming_challenges(level_id,title,statement,starter_code,expected_output,xp_reward) values ((select id from levels where slug='reto-herencia'),'Animal y Perro','Crea Animal y Perro extends Animal. Sobrescribe sonido() para que Perro imprima Guau.',$code$public class Main {
  public static void main(String[] args) {
    // Crea un Perro y llama sonido()
  }
}
$code$,$out$Guau$out$,30);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='polimorfismo'),'intro-polimorfismo','Una referencia, varias formas','Comprende cómo una referencia base puede apuntar a distintos subtipos.',1,540,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='intro-polimorfismo'),'Una referencia, varias formas','El polimorfismo aparece cuando una referencia de un tipo general trabaja con objetos de distintos subtipos y cada uno responde según su implementación.
En este nivel: Comprende cómo una referencia base puede apuntar a distintos subtipos.',$code$Animal a = new Perro();
a.sonido(); // Guau$code$,'polymorphism',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='intro-polimorfismo'),'¿Qué permite el polimorfismo?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-polimorfismo' order by a.id desc limit 1),'Que una referencia general invoque el comportamiento propio del objeto concreto',true,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-polimorfismo' order by a.id desc limit 1),'Que Java no use clases',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-polimorfismo' order by a.id desc limit 1),'Que todos los métodos sean static',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='intro-polimorfismo' order by a.id desc limit 1),'Que no existan interfaces',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='polimorfismo'),'override-dinamico','Despacho dinámico','Observa cómo Java elige el método sobrescrito en ejecución.',2,570,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='override-dinamico'),'Despacho dinámico','El polimorfismo aparece cuando una referencia de un tipo general trabaja con objetos de distintos subtipos y cada uno responde según su implementación.
En este nivel: Observa cómo Java elige el método sobrescrito en ejecución.',$code$Animal a = new Perro();
a.sonido(); // Guau$code$,'polymorphism',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='override-dinamico'),'¿Qué permite el polimorfismo?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='override-dinamico' order by a.id desc limit 1),'Que una referencia general invoque el comportamiento propio del objeto concreto',true,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='override-dinamico' order by a.id desc limit 1),'Que Java no use clases',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='override-dinamico' order by a.id desc limit 1),'Que todos los métodos sean static',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='override-dinamico' order by a.id desc limit 1),'Que no existan interfaces',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='polimorfismo'),'interfaces','Interfaces','Programa contra contratos en lugar de implementaciones concretas.',3,600,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='interfaces'),'Interfaces','El polimorfismo aparece cuando una referencia de un tipo general trabaja con objetos de distintos subtipos y cada uno responde según su implementación.
En este nivel: Programa contra contratos en lugar de implementaciones concretas.',$code$Animal a = new Perro();
a.sonido(); // Guau$code$,'polymorphism',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='interfaces'),'¿Qué permite el polimorfismo?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='interfaces' order by a.id desc limit 1),'Que una referencia general invoque el comportamiento propio del objeto concreto',true,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='interfaces' order by a.id desc limit 1),'Que Java no use clases',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='interfaces' order by a.id desc limit 1),'Que todos los métodos sean static',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='interfaces' order by a.id desc limit 1),'Que no existan interfaces',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='polimorfismo'),'colecciones-polimorficas','Colecciones polimórficas','Agrupa objetos diferentes bajo un tipo común.',4,630,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='colecciones-polimorficas'),'Colecciones polimórficas','El polimorfismo aparece cuando una referencia de un tipo general trabaja con objetos de distintos subtipos y cada uno responde según su implementación.
En este nivel: Agrupa objetos diferentes bajo un tipo común.',$code$Animal a = new Perro();
a.sonido(); // Guau$code$,'polymorphism',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='colecciones-polimorficas'),'¿Qué permite el polimorfismo?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='colecciones-polimorficas' order by a.id desc limit 1),'Que una referencia general invoque el comportamiento propio del objeto concreto',true,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='colecciones-polimorficas' order by a.id desc limit 1),'Que Java no use clases',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='colecciones-polimorficas' order by a.id desc limit 1),'Que todos los métodos sean static',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='colecciones-polimorficas' order by a.id desc limit 1),'Que no existan interfaces',false,4);
insert into levels(module_id,slug,name,description,sort_order,required_xp,xp_reward) values ((select id from modules where slug='polimorfismo'),'reto-polimorfismo','Reto final de polimorfismo','Resuelve un escenario con comportamiento dinámico.',5,660,20);
insert into contents(level_id,title,body,code_example,visual_type,sort_order) values ((select id from levels where slug='reto-polimorfismo'),'Reto final de polimorfismo','El polimorfismo aparece cuando una referencia de un tipo general trabaja con objetos de distintos subtipos y cada uno responde según su implementación.
En este nivel: Resuelve un escenario con comportamiento dinámico.',$code$Animal a = new Perro();
a.sonido(); // Guau$code$,'polymorphism',1);
insert into activities(level_id,question,feedback_correct,feedback_incorrect,xp_reward) values ((select id from levels where slug='reto-polimorfismo'),'¿Qué permite el polimorfismo?','Correcto. La respuesta coincide con el concepto trabajado.','Revisa el contenido del nivel y vuelve a intentarlo.',10);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-polimorfismo' order by a.id desc limit 1),'Que una referencia general invoque el comportamiento propio del objeto concreto',true,1);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-polimorfismo' order by a.id desc limit 1),'Que Java no use clases',false,2);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-polimorfismo' order by a.id desc limit 1),'Que todos los métodos sean static',false,3);
insert into activity_options(activity_id,option_text,is_correct,sort_order) values ((select a.id from activities a join levels l on l.id=a.level_id where l.slug='reto-polimorfismo' order by a.id desc limit 1),'Que no existan interfaces',false,4);
insert into programming_challenges(level_id,title,statement,starter_code,expected_output,xp_reward) values ((select id from levels where slug='reto-polimorfismo'),'Sonidos polimórficos','Usa una referencia Animal con un objeto Perro y luego Gato. Imprime Guau y Miau, cada uno en una línea.',$code$public class Main {
  public static void main(String[] args) {
    // Demuestra polimorfismo aquí
  }
}
$code$,$out$Guau
Miau$out$,30);
insert into rewards(slug,name,description,icon,xp_threshold) values ('primer-paso','Primer paso','Alcanzaste tus primeros 100 XP.','🌟',100),('explorador','Explorador POO','Superaste 300 XP explorando niveles.','🧭',300),('programador','Programador Java','Llegaste a 500 XP resolviendo actividades y retos.','☕',500),('maestro-poo','Maestro POO','Alcanzaste 700 XP en POOQuest.','🏆',700);