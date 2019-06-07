package org.dobo.tss;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter{

	
	//Saving the user data in-memory just for the sake of showing an example authentication system.
	//Password are encoded with an NoOpPasswordEncoder which does not provide any kind of real encoding
	//but is useful for testing purposes.
 	@Override
 	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
 		auth.inMemoryAuthentication().withUser("John").password("{noop}Snow").roles("USER")
 		.and().withUser("Han").password("{noop}Solo").roles("ADMIN");
 	}
 	
 	//CSRF (Cross-Site-Request-Forgery) disabled for testing purposes
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests().antMatchers("/favicon.ico", "/built/**","/css/**", "/images/**").permitAll() 
			.anyRequest().authenticated().and()
			.formLogin().loginPage("/login").defaultSuccessUrl("/",true)
			.permitAll().and()
			.httpBasic().and()
			.csrf().disable()
			.logout().logoutSuccessUrl("/");
	}
}
