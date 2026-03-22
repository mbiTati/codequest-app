/**
 * CODEQUEST M05 — Heritage
 * Exercice : Catalogue d'Inventions avec heritage
 * 
 * CONSIGNES :
 * 1. Completer la classe InventionLogicielle (extends Invention)
 * 2. Completer la classe InventionMecanique (extends Invention)
 * 3. Creer un Catalogue qui stocke des Invention (polymorphisme)
 * 4. Tester dans le main
 */

// ======== CLASSE PARENT ========
class Invention {
    protected String nom;
    protected int annee;
    protected String inventeur;

    public Invention(String nom, int annee, String inventeur) {
        this.nom = nom;
        this.annee = annee;
        this.inventeur = inventeur;
    }

    public String decrire() {
        return nom + " (" + annee + ") par " + inventeur;
    }

    // Getters
    public String getNom() { return nom; }
    public int getAnnee() { return annee; }
    public String getInventeur() { return inventeur; }
}

// ======== CLASSE ENFANT 1 — A COMPLETER ========
class InventionLogicielle extends Invention {
    // TODO : attribut prive String langage
    // TODO : attribut prive int nbLignes

    public InventionLogicielle(String nom, int annee, String inventeur, String langage, int nbLignes) {
        // TODO : appeler super(...) 
        // TODO : initialiser langage et nbLignes
    }

    // TODO : @Override decrire() 
    // Doit retourner : "nom (annee) par inventeur — langage, nbLignes lignes"

    // TODO : getters pour langage et nbLignes
}

// ======== CLASSE ENFANT 2 — A COMPLETER ========
// TODO : creer InventionMecanique extends Invention
// Attributs : int nbPieces, double poids
// Constructeur avec super(...)
// @Override decrire() : ajouter nbPieces pieces, poids kg
// Getters

// ======== CATALOGUE — A COMPLETER ========
// TODO : classe Catalogue avec :
// - ArrayList<Invention> inventions
// - ajouter(Invention inv)
// - afficherTout() — utilise le polymorphisme !
// - rechercherParInventeur(String inventeur) — retourne ArrayList<Invention>
// - compter() — retourne le nombre total

// ======== MAIN ========
class TestHeritage {
    public static void main(String[] args) {
        // TODO : creer un Catalogue
        // TODO : ajouter des Invention, InventionLogicielle, InventionMecanique
        // TODO : afficherTout() — observer le polymorphisme
        // TODO : rechercher par inventeur

        System.out.println("=== Test Heritage ===");
        // Decommenter quand les classes sont completes :
        // Catalogue cat = new Catalogue();
        // cat.ajouter(new Invention("Roue", -3500, "Inconnu"));
        // cat.ajouter(new InventionLogicielle("Java", 1995, "James Gosling", "Java", 1000000));
        // cat.ajouter(new InventionMecanique("Machine a vapeur", 1712, "Newcomen", 50, 2000.0));
        // cat.afficherTout();
    }
}
