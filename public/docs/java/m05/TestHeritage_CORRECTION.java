import java.util.ArrayList;

/**
 * CODEQUEST M05 — Heritage — CORRECTION
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

    public String getNom() { return nom; }
    public int getAnnee() { return annee; }
    public String getInventeur() { return inventeur; }
}

// ======== CLASSE ENFANT 1 ========
class InventionLogicielle extends Invention {
    private String langage;
    private int nbLignes;

    public InventionLogicielle(String nom, int annee, String inventeur, String langage, int nbLignes) {
        super(nom, annee, inventeur);
        this.langage = langage;
        this.nbLignes = nbLignes;
    }

    @Override
    public String decrire() {
        return nom + " (" + annee + ") par " + inventeur + " — " + langage + ", " + nbLignes + " lignes";
    }

    public String getLangage() { return langage; }
    public int getNbLignes() { return nbLignes; }
}

// ======== CLASSE ENFANT 2 ========
class InventionMecanique extends Invention {
    private int nbPieces;
    private double poids;

    public InventionMecanique(String nom, int annee, String inventeur, int nbPieces, double poids) {
        super(nom, annee, inventeur);
        this.nbPieces = nbPieces;
        this.poids = poids;
    }

    @Override
    public String decrire() {
        return nom + " (" + annee + ") par " + inventeur + " — " + nbPieces + " pieces, " + poids + " kg";
    }

    public int getNbPieces() { return nbPieces; }
    public double getPoids() { return poids; }
}

// ======== CATALOGUE ========
class Catalogue {
    private ArrayList<Invention> inventions;

    public Catalogue() {
        this.inventions = new ArrayList<>();
    }

    public void ajouter(Invention inv) {
        inventions.add(inv);
    }

    public void afficherTout() {
        System.out.println("--- Catalogue (" + inventions.size() + " inventions) ---");
        for (Invention inv : inventions) {
            System.out.println("  " + inv.decrire()); // POLYMORPHISME !
        }
    }

    public ArrayList<Invention> rechercherParInventeur(String inventeur) {
        ArrayList<Invention> resultats = new ArrayList<>();
        for (Invention inv : inventions) {
            if (inv.getInventeur().equalsIgnoreCase(inventeur)) {
                resultats.add(inv);
            }
        }
        return resultats;
    }

    public int compter() {
        return inventions.size();
    }
}

// ======== MAIN ========
class TestHeritage_CORRECTION {
    public static void main(String[] args) {
        Catalogue cat = new Catalogue();

        cat.ajouter(new Invention("Roue", -3500, "Inconnu"));
        cat.ajouter(new InventionLogicielle("Java", 1995, "James Gosling", "Java", 1000000));
        cat.ajouter(new InventionLogicielle("Python", 1991, "Guido van Rossum", "C", 500000));
        cat.ajouter(new InventionMecanique("Machine a vapeur", 1712, "Newcomen", 50, 2000.0));
        cat.ajouter(new InventionMecanique("Automobile", 1886, "Karl Benz", 300, 1200.0));

        cat.afficherTout();

        System.out.println("\n--- Recherche : James Gosling ---");
        for (Invention inv : cat.rechercherParInventeur("James Gosling")) {
            System.out.println("  " + inv.decrire());
        }

        System.out.println("\nTotal : " + cat.compter() + " inventions");
    }
}
