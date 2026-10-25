-- POOQuest - parche de contenido pedagógico v2
-- Actualiza contenido, actividades y recursos visuales SIN borrar usuarios, XP, progreso ni intentos.
-- Ejecutar una sola vez en Supabase SQL Editor sobre una base ya creada con schema.sql + seed.sql.

begin;

-- =========================================================
-- MÓDULO 1: ABSTRACCIÓN
-- =========================================================

-- Nivel 1: Introducción a la abstracción
update public.contents set
  body = $body$Abstraer significa quedarse con la información que realmente ayuda a resolver un problema y dejar fuera detalles que no cambian la solución. En programación no intentamos copiar toda la realidad: construimos un modelo útil para el objetivo del sistema.
Por ejemplo, en una aplicación de biblioteca un libro puede necesitar título, autor, código y disponibilidad. El color de la portada podría existir en la vida real, pero no es necesario si el sistema solo controla préstamos.$body$,
  code_example = $code$class Libro {
    String titulo;
    String autor;
    boolean disponible;
}$code$,
  visual_type = 'abstraction_intro'
where level_id = (select id from public.levels where slug='intro-abstraccion');

update public.activities set
  question = 'Para un sistema que controla préstamos de libros, ¿qué información representa mejor una abstracción útil?',
  feedback_correct = 'Correcto. Elegiste datos que aportan directamente al control del préstamo.',
  feedback_incorrect = 'Piensa en qué datos necesita realmente el sistema para prestar y devolver un libro.'
where level_id = (select id from public.levels where slug='intro-abstraccion');

update public.activity_options set option_text='Título, autor, código y disponibilidad', is_correct=true
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-abstraccion')) and sort_order=1;
update public.activity_options set option_text='Color de la portada, tipo de papel y tamaño de la letra', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-abstraccion')) and sort_order=2;
update public.activity_options set option_text='Todos los datos posibles del libro, aunque no se utilicen', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-abstraccion')) and sort_order=3;
update public.activity_options set option_text='Solo una fotografía del libro', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-abstraccion')) and sort_order=4;

-- Nivel 2: Clases y objetos
update public.contents set
  body = $body$Una clase define una estructura común: indica qué datos tendrá un tipo de elemento y qué acciones podrá realizar. Un objeto es una instancia concreta creada a partir de esa clase.
Si Libro es la clase, cada libro registrado es un objeto diferente. Todos comparten la misma estructura, pero cada uno puede tener valores distintos en sus atributos.$body$,
  code_example = $code$class Libro {
    String titulo;

    Libro(String titulo) {
        this.titulo = titulo;
    }
}

Libro libro1 = new Libro("Clean Code");
Libro libro2 = new Libro("Effective Java");$code$,
  visual_type = 'class_object'
where level_id = (select id from public.levels where slug='clases-objetos');

update public.activities set
  question = '¿Cuál afirmación diferencia correctamente una clase de un objeto?',
  feedback_correct = 'Correcto. La clase funciona como definición y el objeto es una instancia concreta.',
  feedback_incorrect = 'Revisa la diferencia entre el molde definido por la clase y las instancias creadas con new.'
where level_id = (select id from public.levels where slug='clases-objetos');

update public.activity_options set option_text='La clase define la estructura y el objeto es una instancia con valores propios', is_correct=true
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='clases-objetos')) and sort_order=1;
update public.activity_options set option_text='La clase y el objeto son exactamente lo mismo', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='clases-objetos')) and sort_order=2;
update public.activity_options set option_text='Un objeto crea clases automáticamente', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='clases-objetos')) and sort_order=3;
update public.activity_options set option_text='Una clase solo puede producir un objeto', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='clases-objetos')) and sort_order=4;

-- Nivel 3: Atributos y métodos
update public.contents set
  body = $body$Los atributos representan el estado de un objeto y los métodos representan acciones o comportamientos. Juntos describen qué información conserva el objeto y qué puede hacer con ella.
En una cuenta bancaria, saldo es parte del estado. consignar() modifica ese estado siguiendo una operación definida por la clase.$body$,
  code_example = $code$class Cuenta {
    double saldo;

    void consignar(double valor) {
        saldo += valor;
    }
}$code$,
  visual_type = 'attributes_methods'
where level_id = (select id from public.levels where slug='atributos-metodos');

update public.activities set
  question = 'En la clase Cuenta, ¿cuál elemento representa un comportamiento?',
  feedback_correct = 'Correcto. consignar() es un método porque define una acción del objeto.',
  feedback_incorrect = 'Los atributos guardan estado; los métodos representan acciones.'
where level_id = (select id from public.levels where slug='atributos-metodos');

update public.activity_options set option_text='saldo', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='atributos-metodos')) and sort_order=1;
update public.activity_options set option_text='consignar(double valor)', is_correct=true
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='atributos-metodos')) and sort_order=2;
update public.activity_options set option_text='double', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='atributos-metodos')) and sort_order=3;
update public.activity_options set option_text='class', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='atributos-metodos')) and sort_order=4;

-- Nivel 4: Modelado de problemas
update public.contents set
  body = $body$Modelar un problema consiste en reconocer las entidades relevantes, los datos que necesitan y las responsabilidades que deben cumplir. Una buena abstracción evita clases que guardan información sin relación con su propósito.
Para representar una compra podemos identificar un Pedido con sus productos y total, y darle operaciones como agregarProducto() y calcularTotal().$body$,
  code_example = $code$class Pedido {
    double total;

    void agregarProducto(double precio) {
        total += precio;
    }

    double calcularTotal() {
        return total;
    }
}$code$,
  visual_type = 'problem_modeling'
where level_id = (select id from public.levels where slug='modelado-problemas');

update public.activities set
  question = 'Al modelar un pedido de una tienda, ¿qué opción contiene datos y responsabilidades coherentes?',
  feedback_correct = 'Correcto. El modelo reúne información y operaciones relacionadas con el pedido.',
  feedback_incorrect = 'Busca una opción donde los datos y métodos pertenezcan realmente a la responsabilidad de un pedido.'
where level_id = (select id from public.levels where slug='modelado-problemas');

update public.activity_options set option_text='Pedido: productos, total, agregarProducto() y calcularTotal()', is_correct=true
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='modelado-problemas')) and sort_order=1;
update public.activity_options set option_text='Pedido: colorFavorito, clima y encenderComputador()', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='modelado-problemas')) and sort_order=2;
update public.activity_options set option_text='Pedido: guardar absolutamente todos los datos del cliente y del sistema', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='modelado-problemas')) and sort_order=3;
update public.activity_options set option_text='Pedido sin atributos ni operaciones', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='modelado-problemas')) and sort_order=4;

-- Nivel 5: Reto final de abstracción
update public.contents set
  body = $body$En este nivel se integran las decisiones anteriores: elegir una entidad, conservar sus datos esenciales y ofrecer un comportamiento claro. El reto no exige representar todos los detalles de un libro, sino los necesarios para el resultado solicitado.
Antes de programar, identifica qué atributos necesita Libro, cómo se inicializan y qué responsabilidad tendrá el método mostrar().$body$,
  code_example = $code$class Libro {
    String titulo;
    String autor;

    Libro(String titulo, String autor) {
        this.titulo = titulo;
        this.autor = autor;
    }

    void mostrar() {
        System.out.println(titulo + " - " + autor);
    }
}$code$,
  visual_type = 'abstraction_challenge'
where level_id = (select id from public.levels where slug='reto-abstraccion');

update public.activities set
  question = 'Antes de resolver el reto, ¿qué diseño mantiene una abstracción clara para Libro?',
  feedback_correct = 'Correcto. El diseño conserva los datos necesarios y asigna a Libro una responsabilidad relacionada con ellos.',
  feedback_incorrect = 'Revisa qué datos necesita el reto y qué operación pertenece naturalmente a la clase Libro.'
where level_id = (select id from public.levels where slug='reto-abstraccion');

update public.activity_options set option_text='titulo y autor como atributos; mostrar() como comportamiento', is_correct=true
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-abstraccion')) and sort_order=1;
update public.activity_options set option_text='Guardar cientos de datos no usados para hacer la clase más completa', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-abstraccion')) and sort_order=2;
update public.activity_options set option_text='Usar una variable global y no crear la clase Libro', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-abstraccion')) and sort_order=3;
update public.activity_options set option_text='Hacer que Libro controle también usuarios, préstamos y autenticación', is_correct=false
where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-abstraccion')) and sort_order=4;

-- =========================================================
-- MÓDULO 2: ENCAPSULAMIENTO
-- =========================================================

-- Nivel 1
update public.contents set
  body = $body$El encapsulamiento protege el estado interno de un objeto y evita que cualquier parte del programa lo modifique sin control. La clase define qué información oculta y qué operaciones expone.
Ocultar un atributo no significa que nunca pueda cambiar: significa que el cambio debe pasar por reglas definidas por la propia clase.$body$,
  code_example = $code$class Cuenta {
    private double saldo;

    public double getSaldo() {
        return saldo;
    }
}$code$,
  visual_type = 'encapsulation_intro'
where level_id=(select id from public.levels where slug='intro-encapsulamiento');
update public.activities set
  question='¿Cuál es la principal razón para declarar saldo como private?',
  feedback_correct='Correcto. private evita cambios directos y obliga a usar las operaciones controladas por la clase.',
  feedback_incorrect='El objetivo no es ocultar por ocultar, sino controlar cómo cambia el estado interno.'
where level_id=(select id from public.levels where slug='intro-encapsulamiento');
update public.activity_options set option_text='Evitar modificaciones directas no controladas del saldo',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-encapsulamiento')) and sort_order=1;
update public.activity_options set option_text='Hacer que la clase deje de tener métodos',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-encapsulamiento')) and sort_order=2;
update public.activity_options set option_text='Permitir que cualquier clase cambie el saldo libremente',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-encapsulamiento')) and sort_order=3;
update public.activity_options set option_text='Convertir automáticamente el saldo en una constante',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-encapsulamiento')) and sort_order=4;

-- Nivel 2
update public.contents set
  body=$body$Los modificadores de acceso indican desde dónde puede utilizarse un miembro. private restringe el acceso a la propia clase; public lo hace accesible desde otras clases. Elegirlos de forma intencional ayuda a definir una interfaz clara.
Una práctica habitual es mantener los atributos privados y exponer solo las operaciones que realmente necesita el resto del programa.$body$,
  code_example=$code$class Usuario {
    private String clave;

    public void cambiarClave(String nuevaClave) {
        clave = nuevaClave;
    }
}$code$,
  visual_type='access_modifiers'
where level_id=(select id from public.levels where slug='modificadores-acceso');
update public.activities set
  question='Si un atributo solo debe modificarse dentro de su clase, ¿qué modificador conviene usar?',
  feedback_correct='Correcto. private limita el acceso directo al interior de la clase.',
  feedback_incorrect='Piensa en el modificador que restringe el acceso al interior de la clase.'
where level_id=(select id from public.levels where slug='modificadores-acceso');
update public.activity_options set option_text='private',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='modificadores-acceso')) and sort_order=1;
update public.activity_options set option_text='public',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='modificadores-acceso')) and sort_order=2;
update public.activity_options set option_text='static',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='modificadores-acceso')) and sort_order=3;
update public.activity_options set option_text='final',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='modificadores-acceso')) and sort_order=4;

-- Nivel 3
update public.contents set
  body=$body$Un getter permite consultar un dato privado y un setter puede modificarlo. Sin embargo, no es obligatorio crear ambos para cada atributo. La clase debe exponer solo lo que tenga sentido para sus reglas.
Los setters también pueden validar datos antes de guardarlos, por ejemplo impedir una edad negativa.$body$,
  code_example=$code$class Persona {
    private int edad;

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        if (edad >= 0) this.edad = edad;
    }
}$code$,
  visual_type='getters_setters'
where level_id=(select id from public.levels where slug='getters-setters');
update public.activities set
  question='¿Qué ventaja tiene validar un dato dentro de un setter?',
  feedback_correct='Correcto. La clase puede impedir que su estado quede con valores inválidos.',
  feedback_incorrect='El setter puede ser más que una asignación: puede aplicar reglas antes de modificar el atributo.'
where level_id=(select id from public.levels where slug='getters-setters');
update public.activity_options set option_text='Evitar que se almacenen valores que incumplen las reglas del objeto',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='getters-setters')) and sort_order=1;
update public.activity_options set option_text='Volver públicos todos los atributos',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='getters-setters')) and sort_order=2;
update public.activity_options set option_text='Eliminar la necesidad de crear objetos',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='getters-setters')) and sort_order=3;
update public.activity_options set option_text='Hacer que Java ignore los tipos de datos',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='getters-setters')) and sort_order=4;

-- Nivel 4
update public.contents set
  body=$body$Un objeto tiene invariantes: condiciones que deben mantenerse para que su estado sea válido. Las operaciones públicas son un lugar adecuado para comprobar esas reglas antes de cambiar los atributos.
En una cuenta, consignar un valor negativo no debería reducir el saldo. La clase puede rechazar esa operación y conservar un estado coherente.$body$,
  code_example=$code$class Cuenta {
    private double saldo;

    public void consignar(double valor) {
        if (valor > 0) {
            saldo += valor;
        }
    }
}$code$,
  visual_type='state_validation'
where level_id=(select id from public.levels where slug='validacion-estado');
update public.activities set
  question='¿Qué debe hacer consignar(-50) si la regla indica que solo se aceptan valores positivos?',
  feedback_correct='Correcto. La operación debe rechazar el valor y mantener el estado válido.',
  feedback_incorrect='Una regla de encapsulamiento debe impedir que una operación inválida altere el estado.'
where level_id=(select id from public.levels where slug='validacion-estado');
update public.activity_options set option_text='No modificar el saldo',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='validacion-estado')) and sort_order=1;
update public.activity_options set option_text='Restar 50 al saldo',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='validacion-estado')) and sort_order=2;
update public.activity_options set option_text='Hacer público el atributo saldo',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='validacion-estado')) and sort_order=3;
update public.activity_options set option_text='Eliminar la condición y aceptar cualquier valor',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='validacion-estado')) and sort_order=4;

-- Nivel 5
update public.contents set
  body=$body$El reto final combina atributos privados, métodos públicos y validación. El objetivo es que la clase Cuenta sea responsable de proteger su propio saldo y no dependa de que el código externo recuerde todas las reglas.
Antes de ejecutar, revisa que un valor negativo no cambie el saldo y que el resultado final coincida con lo solicitado.$body$,
  code_example=$code$class Cuenta {
    private double saldo;

    public void consignar(double valor) {
        if (valor > 0) saldo += valor;
    }

    public double getSaldo() {
        return saldo;
    }
}$code$,
  visual_type='encapsulation_challenge'
where level_id=(select id from public.levels where slug='reto-encapsulamiento');
update public.activities set
  question='¿Qué diseño protege mejor el saldo de una cuenta?',
  feedback_correct='Correcto. El atributo privado y las operaciones validadas mantienen el control dentro de la clase.',
  feedback_incorrect='Busca el diseño en el que la propia clase controle cómo se consulta y modifica el saldo.'
where level_id=(select id from public.levels where slug='reto-encapsulamiento');
update public.activity_options set option_text='saldo private y métodos públicos que validan las operaciones',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-encapsulamiento')) and sort_order=1;
update public.activity_options set option_text='saldo public para modificarlo desde cualquier parte',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-encapsulamiento')) and sort_order=2;
update public.activity_options set option_text='saldo global fuera de la clase',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-encapsulamiento')) and sort_order=3;
update public.activity_options set option_text='sin atributos; cada método inventa un saldo diferente',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-encapsulamiento')) and sort_order=4;

-- =========================================================
-- MÓDULO 3: HERENCIA
-- =========================================================

-- Nivel 1
update public.contents set
  body=$body$La herencia representa una relación "es un". Una clase hija parte de una clase base y puede reutilizar miembros accesibles, además de agregar o especializar comportamiento.
Perro es un Animal, por lo que esa relación puede representarse con herencia. En cambio, Motor no es un Carro: allí corresponde una relación de composición, no herencia.$body$,
  code_example=$code$class Animal {
    void respirar() { }
}

class Perro extends Animal {
    void ladrar() { }
}$code$,
  visual_type='inheritance_intro'
where level_id=(select id from public.levels where slug='intro-herencia');
update public.activities set
  question='¿Cuál relación es un buen ejemplo de herencia?',
  feedback_correct='Correcto. Perro es un tipo de Animal, por eso la relación "es un" tiene sentido.',
  feedback_incorrect='Busca una relación donde la clase hija pueda afirmarse como un tipo de la clase base.'
where level_id=(select id from public.levels where slug='intro-herencia');
update public.activity_options set option_text='Perro es un Animal',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-herencia')) and sort_order=1;
update public.activity_options set option_text='Motor es un Carro',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-herencia')) and sort_order=2;
update public.activity_options set option_text='Teclado es un Computador',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-herencia')) and sort_order=3;
update public.activity_options set option_text='Libro es una Biblioteca',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-herencia')) and sort_order=4;

-- Nivel 2
update public.contents set
  body=$body$Java utiliza extends para indicar que una clase hereda de otra. Cuando la clase base tiene un constructor, la clase hija puede usar super(...) para inicializar la parte heredada del objeto.
La llamada a super(...) debe ser la primera instrucción del constructor de la clase hija.$body$,
  code_example=$code$class Persona {
    String nombre;
    Persona(String nombre) { this.nombre = nombre; }
}

class Estudiante extends Persona {
    Estudiante(String nombre) {
        super(nombre);
    }
}$code$,
  visual_type='extends_super'
where level_id=(select id from public.levels where slug='extends-super');
update public.activities set
  question='¿Para qué se utiliza super(nombre) en el constructor de Estudiante?',
  feedback_correct='Correcto. super(...) llama al constructor de la clase base para inicializar la parte heredada.',
  feedback_incorrect='Revisa cómo una clase hija inicializa los atributos que pertenecen a su clase base.'
where level_id=(select id from public.levels where slug='extends-super');
update public.activity_options set option_text='Para llamar al constructor de Persona',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='extends-super')) and sort_order=1;
update public.activity_options set option_text='Para crear una segunda clase Estudiante',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='extends-super')) and sort_order=2;
update public.activity_options set option_text='Para convertir nombre en una variable global',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='extends-super')) and sort_order=3;
update public.activity_options set option_text='Para impedir la herencia',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='extends-super')) and sort_order=4;

-- Nivel 3
update public.contents set
  body=$body$La sobrescritura ocurre cuando una clase hija proporciona su propia implementación de un método heredado con la misma firma. La anotación @Override ayuda al compilador a comprobar que realmente se está sobrescribiendo un método existente.
Esto permite conservar una operación común, pero adaptar su comportamiento según el subtipo.$body$,
  code_example=$code$class Animal {
    void sonido() { System.out.println("Sonido"); }
}

class Perro extends Animal {
    @Override
    void sonido() { System.out.println("Guau"); }
}$code$,
  visual_type='method_override'
where level_id=(select id from public.levels where slug='sobrescritura');
update public.activities set
  question='¿Qué condición caracteriza una sobrescritura de método?',
  feedback_correct='Correcto. La clase hija mantiene la misma firma y reemplaza la implementación heredada.',
  feedback_incorrect='No confundas sobrescritura con crear un método totalmente diferente o con sobrecarga.'
where level_id=(select id from public.levels where slug='sobrescritura');
update public.activity_options set option_text='La clase hija define el mismo método heredado con una implementación propia',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='sobrescritura')) and sort_order=1;
update public.activity_options set option_text='El método debe cambiar obligatoriamente de nombre',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='sobrescritura')) and sort_order=2;
update public.activity_options set option_text='Solo puede hacerse con atributos',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='sobrescritura')) and sort_order=3;
update public.activity_options set option_text='La clase hija elimina la clase base',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='sobrescritura')) and sort_order=4;

-- Nivel 4
update public.contents set
  body=$body$Una jerarquía bien diseñada coloca el comportamiento común en una clase base y deja en las clases hijas aquello que realmente cambia. Esto reduce duplicación, pero no conviene usar herencia solo para reutilizar unas pocas líneas.
Antes de crear una jerarquía, verifica que exista una relación conceptual clara entre los tipos.$body$,
  code_example=$code$class Empleado {
    String nombre;
    double salario;
}

class Desarrollador extends Empleado {
    String lenguaje;
}

class Disenador extends Empleado {
    String herramienta;
}$code$,
  visual_type='class_hierarchy'
where level_id=(select id from public.levels where slug='jerarquia-clases');
update public.activities set
  question='¿Qué debería ubicarse normalmente en una clase base?',
  feedback_correct='Correcto. La clase base reúne características compartidas por los subtipos.',
  feedback_incorrect='La clase base debe representar lo común; los detalles específicos quedan en cada subtipo.'
where level_id=(select id from public.levels where slug='jerarquia-clases');
update public.activity_options set option_text='Atributos y comportamientos comunes a todas las clases hijas',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='jerarquia-clases')) and sort_order=1;
update public.activity_options set option_text='Solo detalles exclusivos de una única clase hija',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='jerarquia-clases')) and sort_order=2;
update public.activity_options set option_text='Código sin relación con la jerarquía',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='jerarquia-clases')) and sort_order=3;
update public.activity_options set option_text='Todas las variables locales del programa',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='jerarquia-clases')) and sort_order=4;

-- Nivel 5
update public.contents set
  body=$body$El reto final aplica relación "es un", extends y sobrescritura. Animal define un comportamiento general y Perro lo especializa. El resultado esperado permite comprobar que la implementación de la clase hija se está ejecutando.
Usa @Override para que Java te ayude a detectar errores en la firma del método.$body$,
  code_example=$code$class Animal {
    void sonido() { System.out.println("..."); }
}

class Perro extends Animal {
    @Override
    void sonido() { System.out.println("Guau"); }
}$code$,
  visual_type='inheritance_challenge'
where level_id=(select id from public.levels where slug='reto-herencia');
update public.activities set
  question='Si Perro extends Animal y sobrescribe sonido(), ¿qué debe imprimir new Perro().sonido()?',
  feedback_correct='Correcto. La implementación sobrescrita de Perro reemplaza el comportamiento heredado para ese objeto.',
  feedback_incorrect='Recuerda que el método sobrescrito de la clase hija es el que se ejecuta en un objeto Perro.'
where level_id=(select id from public.levels where slug='reto-herencia');
update public.activity_options set option_text='Guau',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-herencia')) and sort_order=1;
update public.activity_options set option_text='Siempre ... aunque exista sobrescritura',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-herencia')) and sort_order=2;
update public.activity_options set option_text='No puede ejecutarse ningún método heredado',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-herencia')) and sort_order=3;
update public.activity_options set option_text='El nombre de la clase',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-herencia')) and sort_order=4;

-- =========================================================
-- MÓDULO 4: POLIMORFISMO
-- =========================================================

-- Nivel 1
update public.contents set
  body=$body$El polimorfismo permite trabajar con objetos diferentes mediante un tipo común. Una referencia de tipo Animal puede apuntar a un Perro o a un Gato porque ambos son subtipos compatibles.
Esto reduce decisiones manuales en el código: cada objeto conserva su implementación y responde de acuerdo con su tipo real.$body$,
  code_example=$code$Animal animal1 = new Perro();
Animal animal2 = new Gato();

animal1.sonido();
animal2.sonido();$code$,
  visual_type='polymorphism_intro'
where level_id=(select id from public.levels where slug='intro-polimorfismo');
update public.activities set
  question='¿Qué permite una referencia Animal en un diseño polimórfico?',
  feedback_correct='Correcto. Puede referenciar distintos subtipos compatibles y usar una interfaz común.',
  feedback_incorrect='Piensa en una referencia del tipo base trabajando con objetos de diferentes clases hijas.'
where level_id=(select id from public.levels where slug='intro-polimorfismo');
update public.activity_options set option_text='Apuntar a objetos como Perro o Gato si ambos son Animal',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-polimorfismo')) and sort_order=1;
update public.activity_options set option_text='Apuntar únicamente a objetos creados exactamente como Animal',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-polimorfismo')) and sort_order=2;
update public.activity_options set option_text='Eliminar la necesidad de métodos',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-polimorfismo')) and sort_order=3;
update public.activity_options set option_text='Cambiar el tipo de Java en tiempo de compilación',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='intro-polimorfismo')) and sort_order=4;

-- Nivel 2
update public.contents set
  body=$body$El despacho dinámico es la decisión que toma Java en tiempo de ejecución para elegir qué implementación sobrescrita debe invocar. Aunque la referencia sea del tipo base, el método ejecutado corresponde al tipo real del objeto.
Por eso Animal a = new Perro(); a.sonido(); ejecuta sonido() de Perro.$body$,
  code_example=$code$Animal a = new Perro();
a.sonido(); // imprime Guau$code$,
  visual_type='dynamic_dispatch'
where level_id=(select id from public.levels where slug='override-dinamico');
update public.activities set
  question='¿Qué determina qué versión de sonido() se ejecuta en Animal a = new Perro(); a.sonido();?',
  feedback_correct='Correcto. En métodos sobrescritos, Java usa el tipo real del objeto en tiempo de ejecución.',
  feedback_incorrect='La referencia es Animal, pero el objeto creado es Perro; ahí está la clave del despacho dinámico.'
where level_id=(select id from public.levels where slug='override-dinamico');
update public.activity_options set option_text='El tipo real del objeto: Perro',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='override-dinamico')) and sort_order=1;
update public.activity_options set option_text='Siempre el tipo escrito a la izquierda: Animal',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='override-dinamico')) and sort_order=2;
update public.activity_options set option_text='El nombre de la variable a',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='override-dinamico')) and sort_order=3;
update public.activity_options set option_text='La última clase declarada en el archivo',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='override-dinamico')) and sort_order=4;

-- Nivel 3
update public.contents set
  body=$body$Una interfaz define un contrato: especifica operaciones que diferentes clases pueden implementar. El código que usa la interfaz no necesita conocer la clase concreta mientras el objeto cumpla ese contrato.
Esto favorece el polimorfismo porque varias implementaciones pueden utilizarse mediante el mismo tipo de referencia.$body$,
  code_example=$code$interface Notificable {
    void enviar(String mensaje);
}

class Email implements Notificable {
    public void enviar(String mensaje) {
        System.out.println("Email: " + mensaje);
    }
}$code$,
  visual_type='interfaces_contract'
where level_id=(select id from public.levels where slug='interfaces');
update public.activities set
  question='¿Qué ventaja ofrece programar usando una interfaz como Notificable?',
  feedback_correct='Correcto. El código puede trabajar con distintas implementaciones sin depender de una clase concreta.',
  feedback_incorrect='Una interfaz permite depender de un contrato común y sustituir implementaciones compatibles.'
where level_id=(select id from public.levels where slug='interfaces');
update public.activity_options set option_text='Permite usar diferentes implementaciones mediante el mismo contrato',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='interfaces')) and sort_order=1;
update public.activity_options set option_text='Obliga a que todas las clases tengan exactamente los mismos atributos',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='interfaces')) and sort_order=2;
update public.activity_options set option_text='Hace innecesario crear métodos',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='interfaces')) and sort_order=3;
update public.activity_options set option_text='Impide cambiar de implementación',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='interfaces')) and sort_order=4;

-- Nivel 4
update public.contents set
  body=$body$Una colección polimórfica almacena objetos de diferentes subtipos bajo un tipo común. Al recorrerla, el mismo mensaje puede producir comportamientos distintos según cada objeto.
Esto es útil cuando el algoritmo general es el mismo para todos los elementos y la variación pertenece a cada implementación concreta.$body$,
  code_example=$code$List<Animal> animales = List.of(new Perro(), new Gato());

for (Animal animal : animales) {
    animal.sonido();
}$code$,
  visual_type='polymorphic_collection'
where level_id=(select id from public.levels where slug='colecciones-polimorficas');
update public.activities set
  question='¿Qué ventaja tiene una List<Animal> con Perro y Gato?',
  feedback_correct='Correcto. Se recorren distintos subtipos de forma uniforme y cada uno ejecuta su comportamiento.',
  feedback_incorrect='La idea es tratar objetos distintos con el tipo común y dejar que cada objeto responda según su implementación.'
where level_id=(select id from public.levels where slug='colecciones-polimorficas');
update public.activity_options set option_text='Permite recorrer objetos distintos con la misma operación sonido()',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='colecciones-polimorficas')) and sort_order=1;
update public.activity_options set option_text='Convierte todos los objetos en la misma clase concreta',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='colecciones-polimorficas')) and sort_order=2;
update public.activity_options set option_text='Evita por completo el uso de herencia o interfaces',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='colecciones-polimorficas')) and sort_order=3;
update public.activity_options set option_text='Obliga a usar un if diferente por cada elemento',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='colecciones-polimorficas')) and sort_order=4;

-- Nivel 5
update public.contents set
  body=$body$El reto final reúne referencia base, objetos de distintos subtipos y métodos sobrescritos. El mismo llamado a sonido() debe producir una salida diferente según el objeto que reciba la referencia.
Si tu solución necesita preguntar manualmente "¿eres Perro o Gato?" antes de cada llamada, revisa si realmente estás aprovechando el polimorfismo.$body$,
  code_example=$code$Animal animal = new Perro();
animal.sonido();

animal = new Gato();
animal.sonido();$code$,
  visual_type='polymorphism_challenge'
where level_id=(select id from public.levels where slug='reto-polimorfismo');
update public.activities set
  question='¿Qué salida representa correctamente el comportamiento polimórfico del reto?',
  feedback_correct='Correcto. La misma referencia ejecuta la implementación correspondiente a cada objeto concreto.',
  feedback_incorrect='Observa qué objeto tiene asignado la referencia antes de cada llamada a sonido().' 
where level_id=(select id from public.levels where slug='reto-polimorfismo');
update public.activity_options set option_text='Guau y luego Miau',is_correct=true where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-polimorfismo')) and sort_order=1;
update public.activity_options set option_text='Animal y luego Animal',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-polimorfismo')) and sort_order=2;
update public.activity_options set option_text='Guau y luego Guau aunque el objeto cambie a Gato',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-polimorfismo')) and sort_order=3;
update public.activity_options set option_text='No se puede reasignar una referencia Animal',is_correct=false where activity_id=(select id from public.activities where level_id=(select id from public.levels where slug='reto-polimorfismo')) and sort_order=4;

commit;

-- Verificación rápida opcional:
-- select m.name as modulo,l.sort_order,l.name,c.title,a.question
-- from public.levels l
-- join public.modules m on m.id=l.module_id
-- left join public.contents c on c.level_id=l.id
-- left join public.activities a on a.level_id=l.id
-- order by m.sort_order,l.sort_order;
