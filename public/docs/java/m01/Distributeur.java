import java.util.Scanner;

/**
 * CODEQUEST - Module 01 : Conditions
 * Exercice : Le Distributeur de Boissons
 * 
 * OBJECTIF : Pratiquer if/else, switch/case, && et ||
 * 
 * CONSIGNES :
 * 1. Complétez les TODO
 * 2. Ne modifiez PAS le code qui est déjà écrit
 * 3. Testez avec différentes valeurs
 * 4. Vérifiez les cas de test en bas du fichier
 */
public class Distributeur {
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // ============================================
        // ÉTAPE 1 : Afficher le menu
        // ============================================
        System.out.println("╔═══════════════════════════╗");
        System.out.println("║   DISTRIBUTEUR CODEQUEST  ║");
        System.out.println("╠═══════════════════════════╣");
        System.out.println("║  1. Café       (2.50 CHF) ║");
        System.out.println("║  2. Thé        (2.00 CHF) ║");
        System.out.println("║  3. Chocolat   (3.00 CHF) ║");
        System.out.println("║  4. Jus orange (3.50 CHF) ║");
        System.out.println("╚═══════════════════════════╝");
        
        // ============================================
        // ÉTAPE 2 : Lire le choix de l'utilisateur
        // ============================================
        System.out.print("Votre choix (1-4) : ");
        int choix = sc.nextInt();
        
        // ============================================
        // ÉTAPE 3 : Déterminer le nom et le prix
        // Utilisez un SWITCH sur la variable choix
        // ============================================
        String nom = "";
        double prix = 0;
        
        // TODO : Écrivez le switch ici
        // switch (choix) {
        //     case 1:
        //         nom = "Café";
        //         prix = 2.50;
        //         break;
        //     ... complétez les autres cases
        //     default:
        //         System.out.println("Boisson inconnue !");
        //         sc.close();
        //         return;
        // }
        
        // ============================================
        // ÉTAPE 4 : Lire l'âge
        // ============================================
        System.out.print("Votre âge : ");
        int age = sc.nextInt();
        
        // ============================================
        // ÉTAPE 5 : Calculer la réduction
        // Réduction de 20% si âge < 18 OU âge >= 65
        // Utilisez || (OU logique)
        // ============================================
        double reduction = 0;
        
        // TODO : Écrivez le if avec || ici
        // if (age < 18 || age >= 65) {
        //     reduction = ...
        // }
        
        // ============================================
        // ÉTAPE 6 : Calculer le supplément
        // +0.50 si chocolat (choix == 3) ET âge > 12
        // Utilisez && (ET logique)
        // ============================================
        double supplement = 0;
        
        // TODO : Écrivez le if avec && ici
        // if ( ... && ... ) {
        //     supplement = 0.50;
        // }
        
        // ============================================
        // ÉTAPE 7 : Calculer et afficher le résultat
        // ============================================
        double prixFinal = prix - reduction + supplement;
        
        System.out.println("\n╔═══════════════════════════╗");
        System.out.println("║       VOTRE TICKET        ║");
        System.out.println("╠═══════════════════════════╣");
        System.out.println("║ Boisson   : " + nom);
        System.out.println("║ Prix base : " + prix + " CHF");
        
        // TODO : Affichez la réduction SI elle est > 0
        // if (reduction > 0) { ... }
        
        // TODO : Affichez le supplément SI il est > 0
        // if (supplement > 0) { ... }
        
        System.out.println("║ ─────────────────────────");
        System.out.println("║ TOTAL     : " + prixFinal + " CHF");
        System.out.println("╚═══════════════════════════╝");
        
        sc.close();
    }
}

/*
 * ═══════════════════════════════════════════════
 * CAS DE TEST (vérifiez vos résultats !)
 * ═══════════════════════════════════════════════
 * 
 * Test 1 : Choix=1, Âge=25
 *   → Café, 2.50 CHF, pas de réduction, TOTAL: 2.50
 * 
 * Test 2 : Choix=1, Âge=15
 *   → Café, 2.50 CHF, réduction 0.50, TOTAL: 2.00
 * 
 * Test 3 : Choix=3, Âge=25
 *   → Chocolat, 3.00 CHF, supplément 0.50, TOTAL: 3.50
 * 
 * Test 4 : Choix=3, Âge=10
 *   → Chocolat, 3.00 CHF, réduction 0.60, pas de chantilly, TOTAL: 2.40
 * 
 * Test 5 : Choix=3, Âge=70
 *   → Chocolat, 3.00 CHF, réduction 0.60, supplément 0.50, TOTAL: 2.90
 * 
 * Test 6 : Choix=5, N'importe quel âge
 *   → "Boisson inconnue !"
 */
