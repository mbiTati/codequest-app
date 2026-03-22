/**
 * CODEQUEST - Module 03 : POO Fondamentaux
 * ⚠️ CORRECTION — NE PAS DISTRIBUER AUX ÉTUDIANTS
 */
public class Invention_CORRECTION {
    
    // 1. ATTRIBUTS (private)
    private String nom;
    private String inventeur;
    private int annee;
    private String categorie;
    
    // 2. CONSTRUCTEUR
    public Invention_CORRECTION(String nom, String inventeur, int annee, String categorie) {
        this.nom = nom;
        this.inventeur = inventeur;
        this.annee = annee;
        this.categorie = categorie;
    }
    
    // 3. GETTERS
    public String getNom() { return nom; }
    public String getInventeur() { return inventeur; }
    public int getAnnee() { return annee; }
    public String getCategorie() { return categorie; }
    
    // 4. SETTERS avec validation
    public void setNom(String nom) {
        if (nom != null && !nom.isEmpty()) {
            this.nom = nom;
        }
    }
    
    public void setAnnee(int annee) {
        if (annee > 0 && annee <= 2026) {
            this.annee = annee;
        }
    }
    
    // 5. MÉTHODES MÉTIER
    public void afficher() {
        System.out.println(nom + " (" + annee + ") par " + inventeur + " [" + categorie + "]");
    }
    
    public int getAge() {
        return 2026 - annee;
    }
}
