/**
 * CODEQUEST - Module 03 : POO Fondamentaux
 * Classe de test — Exécutez ceci pour vérifier votre travail
 * 
 * Ce fichier utilise vos classes Invention et Catalogue.
 * Si tout est correct, vous verrez les résultats attendus ci-dessous.
 */
public class TestCatalogue {
    
    public static void main(String[] args) {
        
        System.out.println("╔═══════════════════════════════════╗");
        System.out.println("║  TEST DU CATALOGUE D'INVENTIONS  ║");
        System.out.println("╚═══════════════════════════════════╝\n");
        
        // ── Test 1 : Créer des inventions ──
        System.out.println("--- Test 1 : Création d'inventions ---");
        Invention tel = new Invention("Téléphone", "Bell", 1876, "Communication");
        Invention amp = new Invention("Ampoule", "Edison", 1879, "Électricité");
        Invention rad = new Invention("Radio", "Marconi", 1895, "Communication");
        Invention avion = new Invention("Avion", "Wright", 1903, "Transport");
        Invention web = new Invention("World Wide Web", "Berners-Lee", 1989, "Informatique");
        
        tel.afficher();
        System.out.println("Age du téléphone : " + tel.getAge() + " ans");
        System.out.println();
        
        // ── Test 2 : Getters ──
        System.out.println("--- Test 2 : Getters ---");
        System.out.println("Nom : " + tel.getNom());
        System.out.println("Inventeur : " + tel.getInventeur());
        System.out.println("Année : " + tel.getAnnee());
        System.out.println("Catégorie : " + tel.getCategorie());
        System.out.println();
        
        // ── Test 3 : Setters avec validation ──
        System.out.println("--- Test 3 : Setters avec validation ---");
        tel.setNom("Smartphone");
        System.out.println("Après setNom('Smartphone') : " + tel.getNom());
        // Résultat attendu : Smartphone
        
        tel.setNom("");  // Ne devrait PAS changer
        System.out.println("Après setNom('') : " + tel.getNom());
        // Résultat attendu : Smartphone (inchangé)
        
        tel.setAnnee(-500);  // Ne devrait PAS changer
        System.out.println("Après setAnnee(-500) : " + tel.getAnnee());
        // Résultat attendu : 1876 (inchangé)
        System.out.println();
        
        // ── Test 4 : Catalogue ──
        System.out.println("--- Test 4 : Catalogue ---");
        Catalogue cat = new Catalogue();
        cat.ajouter(tel);
        cat.ajouter(amp);
        cat.ajouter(rad);
        cat.ajouter(avion);
        cat.ajouter(web);
        System.out.println();
        
        cat.afficherTout();
        System.out.println();
        
        // ── Test 5 : Recherche par catégorie ──
        System.out.println("--- Test 5 : Recherche 'Communication' ---");
        for (Invention inv : cat.rechercherParCategorie("Communication")) {
            inv.afficher();
        }
        // Résultat attendu : Smartphone et Radio
        System.out.println();
        
        // ── Test 6 : Plus ancienne ──
        System.out.println("--- Test 6 : Plus ancienne ---");
        Invention ancienne = cat.trouverPlusAncienne();
        if (ancienne != null) {
            System.out.println("La plus ancienne : " + ancienne.getNom() 
                + " (" + ancienne.getAnnee() + ")");
        }
        // Résultat attendu : Smartphone (1876)
        
        System.out.println("\n✅ Si tout s'affiche correctement, bravo !");
    }
}

/*
 * RÉSULTATS ATTENDUS :
 * 
 * --- Test 1 : Création d'inventions ---
 * Téléphone (1876) par Bell [Communication]
 * Age du téléphone : 150 ans
 * 
 * --- Test 2 : Getters ---
 * Nom : Téléphone
 * Inventeur : Bell
 * Année : 1876
 * Catégorie : Communication
 * 
 * --- Test 3 : Setters avec validation ---
 * Après setNom('Smartphone') : Smartphone
 * Après setNom('') : Smartphone
 * Après setAnnee(-500) : 1876
 * 
 * --- Test 4 : Catalogue ---
 * Ajouté : Smartphone
 * Ajouté : Ampoule
 * Ajouté : Radio
 * Ajouté : Avion
 * Ajouté : World Wide Web
 * 
 * === CATALOGUE (5 inventions) ===
 * Smartphone (1876) par Bell [Communication]
 * Ampoule (1879) par Edison [Électricité]
 * Radio (1895) par Marconi [Communication]
 * Avion (1903) par Wright [Transport]
 * World Wide Web (1989) par Berners-Lee [Informatique]
 * 
 * --- Test 5 : Recherche 'Communication' ---
 * Smartphone (1876) par Bell [Communication]
 * Radio (1895) par Marconi [Communication]
 * 
 * --- Test 6 : Plus ancienne ---
 * La plus ancienne : Smartphone (1876)
 */
